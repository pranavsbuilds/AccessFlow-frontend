'use client';

import { useEffect, useRef, useState } from 'react';
import type { InterviewPhase } from '@/types';

interface QuestionDisplayProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  phase: InterviewPhase;
}

const PHASE_SUBTEXT: Record<InterviewPhase, string> = {
  idle: 'Preparing…',
  speaking: 'Reading question…',
  listening: 'Listening…',
  processing: 'Processing your answer…',
  complete: 'Interview complete',
};

/**
 * QuestionDisplay — shows question number, question text, and phase subtext.
 * Phase drives the subtext label. The elapsed timer is visible during 'listening'.
 */
export function QuestionDisplay({
  questionNumber,
  totalQuestions,
  questionText,
  phase,
}: QuestionDisplayProps) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed timer — increments every second while listening
  useEffect(() => {
    if (phase === 'listening') {
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const isListening = phase === 'listening';
  const isSpeaking = phase === 'speaking';
  const isProcessing = phase === 'processing';

  return (
    <div className="question-display">
      {/* Progress header */}
      <div className="question-progress">
        <span className="question-label">
          Question {questionNumber} <span className="question-of">of {totalQuestions}</span>
        </span>

        {/* Progress bar */}
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="question-text-card">
        <p className="question-text">{questionText || '…'}</p>
      </div>

      {/* Phase status */}
      <div className="phase-status">
        {/* Animated indicator dot */}
        <span
          className={[
            'phase-dot',
            isListening ? 'phase-dot--listening' : '',
            isSpeaking ? 'phase-dot--speaking' : '',
            isProcessing ? 'phase-dot--processing' : '',
          ].join(' ')}
        />

        <span className="phase-text">
          {PHASE_SUBTEXT[phase]}
          {isListening && elapsed > 0 && (
            <span className="elapsed-timer"> {elapsed}s</span>
          )}
        </span>
      </div>
    </div>
  );
}
