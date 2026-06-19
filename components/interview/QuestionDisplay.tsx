'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageResponse } from '@/components/ai-elements/message';
import { ANSWER_COUNTDOWN_SECONDS } from '@/lib/constants';
import type { InterviewPhase } from '@/types';

interface QuestionDisplayProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  phase: InterviewPhase;
  liveTranscript: string;
}

const PHASE_SUBTEXT: Record<InterviewPhase, string> = {
  idle: 'Preparing',
  speaking: 'Question in progress',
  listening: 'Answer capture active',
  processing: 'Scoring response',
  complete: 'Interview complete',
};

export function QuestionDisplay({
  questionNumber,
  totalQuestions,
  questionText,
  phase,
  liveTranscript,
}: QuestionDisplayProps) {
  const progressPercent = Math.max(0, Math.min(100, ((questionNumber - 1) / totalQuestions) * 100));
  const transcriptText = liveTranscript.trim() || 'Listening for your answer...';

  return (
    <section className="question-display question-display--active">
      <div className="question-progress">
        <span className="question-label">
          Question {questionNumber} <span className="question-of">of {totalQuestions}</span>
        </span>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="question-text-card question-text-card--active">
        <div className="question-card-topline">
          <span className={`phase-dot phase-dot--${phase}`} />
          <span>{PHASE_SUBTEXT[phase]}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`${questionNumber}-${questionText}`}
            className="question-text question-text--animated"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {questionText || '...'}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="answer-command-row">
        {phase === 'listening' ? <ActiveAnswerCountdown /> : <IdleAnswerCountdown />}

        <div className="phase-status phase-status--compact">
          <span
            className={[
              'phase-dot',
              phase === 'listening' ? 'phase-dot--listening' : '',
              phase === 'speaking' ? 'phase-dot--speaking' : '',
              phase === 'processing' ? 'phase-dot--processing' : '',
            ].join(' ')}
          />
          <span className="phase-text">{PHASE_SUBTEXT[phase]}</span>
        </div>
      </div>

      <div className="live-transcript-panel">
        <div className="live-transcript-header">
          <span>Live transcript</span>
          <span className={phase === 'listening' ? 'transcript-state transcript-state--active' : 'transcript-state'}>
            {phase === 'listening' ? 'Streaming' : 'Standby'}
          </span>
        </div>
        <div className="live-transcript-body">
          <MessageResponse className="live-transcript-markdown">{transcriptText}</MessageResponse>
        </div>
      </div>
    </section>
  );
}

function IdleAnswerCountdown() {
  return (
    <div className="answer-countdown">
      <span className="answer-countdown__label">Answer window</span>
      <strong>{ANSWER_COUNTDOWN_SECONDS}s</strong>
      <span className="answer-countdown__track" aria-hidden="true">
        <span style={{ width: '100%' }} />
      </span>
    </div>
  );
}

function ActiveAnswerCountdown() {
  const [seconds, setSeconds] = useState(ANSWER_COUNTDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownProgress = (seconds / ANSWER_COUNTDOWN_SECONDS) * 100;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="answer-countdown answer-countdown--active">
      <span className="answer-countdown__label">Answer window</span>
      <strong>{seconds}s</strong>
      <span className="answer-countdown__track" aria-hidden="true">
        <span style={{ width: `${countdownProgress}%` }} />
      </span>
    </div>
  );
}
