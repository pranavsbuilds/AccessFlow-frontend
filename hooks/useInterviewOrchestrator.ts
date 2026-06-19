'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { useWebSocket } from './useWebSocket';
import { useAudioCapture } from './useAudioCapture';
import { speak } from '@/lib/tts';
import { TOTAL_QUESTIONS } from '@/lib/constants';
import { scoreAnswer, saveFinalInfo } from '@/lib/api';
import type { ClusterLabel } from '@/types';

/**
 * useInterviewOrchestrator — the core interview loop.
 *
 * State machine:
 *   idle → speaking (TTS plays question)
 *        → listening (WS open, mic streaming)
 *        → [backend closes WS after 5s silence → lastResponse arrives]
 *        → addResponse + advance index → idle (or complete)
 *   complete → router.push('/results')
 *
 * Critical invariants from the implementation plan:
 * - isRunning ref guard checked BEFORE await speak() — not after.
 * - One WebSocket connection per question, never two.
 * - AudioContext created per question in useAudioCapture (not per session).
 * - lastResponse useEffect guarded by isMounted ref to prevent stale state updates.
 * - flagSession is fire-and-forget; never awaited in the hot path.
 */
export function useInterviewOrchestrator(micStream: MediaStream | null) {
  const router = useRouter();
  const {
    sessionId,
    questions,
    explanations,
    currentQuestionIndex,
    interviewPhase,
    setPhase,
    addResponse,
    remainingQuestions,
    remainingExplanations,
    remainingDifficulties,
    currentDifficulty,
    updateQuestionPool,
    setResults,
    sessionPenalty,
  } = useInterviewStore();

  const { connect, disconnect, clearResponse, sendBinary, lastResponse, liveTranscript } = useWebSocket(sessionId);

  // Wire audio capture → WebSocket binary send
  const { startCapture, stopCapture } = useAudioCapture(
    useCallback((chunk: Int16Array) => sendBinary(chunk), [sendBinary])
  );

  // Guards against double-invocation from rapid re-renders
  const isRunning = useRef(false);
  // Prevents stale closure state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const runQuestion = useCallback(async (index: number): Promise<void> => {
    // isRunning guard checked BEFORE await speak(), not after — per implementation plan
    if (isRunning.current) return;
    if (index >= TOTAL_QUESTIONS) return;
    isRunning.current = true;

    try {
      if (!isMounted.current) return;
      setPhase('speaking');
      await speak(questions[index]);

      if (!isMounted.current) return;
      setPhase('listening');
      await connect();

      if (micStream && isMounted.current) {
        await startCapture(micStream);
      }
      // From here, audio flows automatically via useAudioCapture → sendBinary
      // Backend closes the WS after 5s silence and sends the response
    } catch (err) {
      console.error('Question orchestration error:', err);
      isRunning.current = false;
      if (isMounted.current) setPhase('idle');
    }
  }, [questions, connect, startCapture, micStream, setPhase]);

  // Handle incoming WebSocket response — this is what advances the question
  useEffect(() => {
    if (!lastResponse) return;
    if (!isMounted.current) return;

    const processResponse = async () => {
      setPhase('processing');
      stopCapture();
      disconnect();
      clearResponse(); // Clear previous question's response immediately after consumption

      try {
        const payload = {
          answer: lastResponse.transcript,
          explanation: explanations[currentQuestionIndex] || '',
          full_explanation: remainingExplanations,
          questions: remainingQuestions,
          difficulty: remainingDifficulties,
          current_difficulty: currentDifficulty || 'easy',
          previous_question: questions[currentQuestionIndex] || '',
        };

        const res = await scoreAnswer(payload);
        const score = res.current_result / 100;

        if (!isMounted.current) return;

        addResponse({
          questionIndex: currentQuestionIndex,
          transcript: lastResponse.transcript,
          score: score,
        });

        const isLastQuestion = currentQuestionIndex + 1 >= TOTAL_QUESTIONS;

        if (isLastQuestion) {
          const currentStore = useInterviewStore.getState();
          const allScores = [...currentStore.responses, { questionIndex: currentQuestionIndex, transcript: lastResponse.transcript, score }];
          const avgScore = allScores.reduce((sum, r) => sum + r.score, 0) / TOTAL_QUESTIONS;
          const finalScore = Math.max(0, Math.min(1.0, avgScore + currentStore.sessionPenalty)) * 10;
          const finalScoreRounded = Math.round(finalScore * 10) / 10;

          let cluster: ClusterLabel = 'poor';
          if (finalScoreRounded >= 7.5) {
            cluster = 'top';
          } else if (finalScoreRounded >= 5.0) {
            cluster = 'average';
          }

          setResults(finalScoreRounded, cluster);

          try {
            await saveFinalInfo('testuser', finalScoreRounded / 10, Math.round(finalScoreRounded));
          } catch (err) {
            console.error('Failed to save final info to backend:', err);
          }

          setPhase('complete');
        } else {
          updateQuestionPool(
            res.next_question,
            res.next_explanation,
            res.difficulty,
            res.questions,
            res.explanation,
            res.difficulty_list
          );
          setPhase('idle');
        }
      } catch (err) {
        console.error('Failed to score response:', err);
        addResponse({
          questionIndex: currentQuestionIndex,
          transcript: lastResponse.transcript,
          score: 0,
        });
        if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
          setPhase('complete');
        } else {
          setPhase('idle');
        }
      } finally {
        isRunning.current = false;
      }
    };

    processResponse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResponse, clearResponse]);

  // Drive the phase state machine
  useEffect(() => {
    if (!isMounted.current) return;

    if (interviewPhase === 'idle') {
      if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        setPhase('complete');
      } else {
        runQuestion(currentQuestionIndex);
      }
    }
    if (interviewPhase === 'complete') {
      router.push('/results');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewPhase, currentQuestionIndex]);

  // Kick off the first question when the page mounts and mic is ready
  useEffect(() => {
    if (micStream && interviewPhase === 'idle' && currentQuestionIndex === 0) {
      runQuestion(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micStream]);

  return { interviewPhase, liveTranscript };
}
