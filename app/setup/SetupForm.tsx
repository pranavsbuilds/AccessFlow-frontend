'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopicSelector from '@/components/setup/TopicSelector';
import DifficultyPicker from '@/components/setup/DifficultyPicker';
import { useInterviewStore } from '@/store/interviewStore';
import { useSession } from '@/hooks/useSession';
import type { Difficulty, Topic } from '@/types';

export default function SetupForm() {
  const router = useRouter();
  const { startSession } = useSession();

  const setTopic           = useInterviewStore((s) => s.setTopic);
  const setDifficulty      = useInterviewStore((s) => s.setDifficulty);
  const setSessionId       = useInterviewStore((s) => s.setSessionId);
  const setQuestionPool    = useInterviewStore((s) => s.setQuestionPool);
  const selectedTopic      = useInterviewStore((s) => s.selectedTopic);
  const selectedDifficulty = useInterviewStore((s) => s.selectedDifficulty);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const canStart = selectedTopic !== null && selectedDifficulty !== null;

  const handleStart = async () => {
    if (!canStart) return;
    setIsLoading(true);
    setError(null);

    try {
      const { sid, questions, explanations, difficulties } = await startSession(selectedTopic!, selectedDifficulty!);
      setSessionId(sid);
      setQuestionPool(questions, explanations, difficulties, selectedDifficulty!);
      router.push('/check');
    } catch (err) {
      console.error('Session start failed:', err);
      setError(
        'Could not connect to the interview server. Make sure the backend is running on localhost:8000.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Field selection — circular spatial cards */}
      <TopicSelector
        selected={selectedTopic}
        onSelect={(t: Topic) => setTopic(t)}
      />

      {/* Difficulty toggle */}
      <DifficultyPicker
        selected={selectedDifficulty}
        onSelect={(d: Difficulty) => setDifficulty(d)}
      />

      {/* Error message */}
      {error && (
        <div className="max-w-lg mx-auto mb-8 px-6 py-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-sm text-center">
          {error}
        </div>
      )}

      {/* Start button — exactly as S1.1 glass-pill */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleStart}
          disabled={!canStart || isLoading}
          aria-label={!canStart ? 'Select a topic and difficulty to continue' : 'Start interview'}
          className={`glass-pill w-full md:w-[480px] py-10 px-16 rounded-full font-headline text-3xl font-extrabold flex items-center justify-center gap-6 transition-transform active:scale-95 group hover:shadow-[0_0_40px_rgba(126,252,157,0.6)] duration-500${
            canStart && !isLoading
              ? ' hover:scale-[1.02] cursor-pointer'
              : ' opacity-50 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="relative z-20">Initializing…</span>
            </>
          ) : (
            <>
              <span className="relative z-20">Start Interview</span>
              <span className="material-symbols-outlined relative z-20 text-4xl group-hover:translate-x-3 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </button>

        <p className="mt-12 font-mono text-xs tracking-[0.5em] text-on-surface-variant font-bold uppercase">
          {canStart
            ? 'Ready to initialize secure session'
            : 'Select a field and difficulty to continue'}
        </p>
      </div>
    </>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="relative z-20"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}