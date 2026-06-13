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

  const setTopic = useInterviewStore((s) => s.setTopic);
  const setDifficulty = useInterviewStore((s) => s.setDifficulty);
  const setSessionId = useInterviewStore((s) => s.setSessionId);
  const selectedTopic = useInterviewStore((s) => s.selectedTopic);
  const selectedDifficulty = useInterviewStore((s) => s.selectedDifficulty);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStart = selectedTopic !== null && selectedDifficulty !== null;

  const handleStart = async () => {
    if (!canStart) return;
    setIsLoading(true);
    setError(null);

    try {
      const sid = await startSession(selectedTopic!, selectedDifficulty!);
      setSessionId(sid);
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
    <div
      className="card"
      style={{ padding: '32px' }}
    >
      {/* Topic Selection */}
      <div style={{ marginBottom: '28px' }}>
        <TopicSelector
          selected={selectedTopic}
          onSelect={(t: Topic) => setTopic(t)}
        />
      </div>

      {/* Difficulty Selection */}
      <div style={{ marginBottom: '32px' }}>
        <DifficultyPicker
          selected={selectedDifficulty}
          onSelect={(d: Difficulty) => setDifficulty(d)}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'var(--color-border)',
          marginBottom: '28px',
        }}
      />

      {/* What to expect */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {[
          { stat: '10', label: 'questions' },
          { stat: 'adaptive', label: 'difficulty' },
          { stat: 'scored', label: 'by AI' },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--color-phosphor)',
                margin: '0 0 2px 0',
              }}
            >
              {item.stat}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--color-text-disabled)',
                margin: 0,
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              color: 'var(--color-red)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Start Button */}
      <button
        className="btn-primary"
        onClick={handleStart}
        disabled={!canStart || isLoading}
        style={{ width: '100%', fontSize: '0.9rem', padding: '14px' }}
        aria-label={
          !canStart
            ? 'Select a topic and difficulty to continue'
            : 'Start interview'
        }
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Setting up your session…
          </>
        ) : (
          <>
            Start Interview
            <span style={{ opacity: canStart ? 1 : 0.4 }}>→</span>
          </>
        )}
      </button>

      {!canStart && (
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--color-text-disabled)',
            marginTop: '10px',
            marginBottom: 0,
          }}
        >
          Pick a field and difficulty to continue
        </p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{
        animation: 'spin 0.7s linear infinite',
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}