'use client';

// ─── Week 3 Target ────────────────────────────────────────────────────────────
// This page will contain:
//   - WebcamFeed (canvas + video)
//   - QuestionDisplay
//   - RecordingIndicator
//   - DistractionBanner
//   - useAudioCapture + useWebSocket (audio pipeline)
//   - useGazeTracker (Week 4)
//   - useObjectDetector + yoloWorker (Week 4)
// See FRONTEND_PLAN_v2.1.md Section 6 / Screen 3 and Section 14.

import { useInterviewStore } from '@/store/interviewStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InterviewPage() {
  const router = useRouter();
  const sessionId = useInterviewStore((s) => s.sessionId);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/setup');
    }
  }, [sessionId, router]);

  if (!sessionId) return null;

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-void)',
        padding: '40px 24px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-phosphor)',
            background: 'rgba(0,255,136,0.08)',
            padding: '4px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(0,255,136,0.2)',
            display: 'inline-block',
            marginBottom: '20px',
          }}
        >
          Week 3 — Coming Soon
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            color: 'var(--color-text-primary)',
            margin: '0 0 8px 0',
          }}
        >
          Interview screen
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            margin: '0 0 24px 0',
          }}
        >
          Session ID: <code style={{ fontFamily: 'var(--font-data)', color: 'var(--color-phosphor)' }}>{sessionId}</code>
        </p>
        <button
          className="btn-ghost"
          onClick={() => router.push('/check')}
        >
          ← Back to check
        </button>
      </div>
    </main>
  );
}
