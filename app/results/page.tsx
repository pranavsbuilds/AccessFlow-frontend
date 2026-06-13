'use client';

// ─── Week 5 Target ────────────────────────────────────────────────────────────
// This page will contain:
//   - ScoreCard (animated counter + progress ring)
//   - ClusterBadge (Top / Average / Poor)
//   - QuestionBreakdown accordion
//   - WikiLinks cards
//   - "Try Again" button (resetSession + navigate /setup)
// See FRONTEND_PLAN_v2.1.md Section 6 / Screen 4.

import { useInterviewStore } from '@/store/interviewStore';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const finalScore = useInterviewStore((s) => s.finalScore);
  const clusterLabel = useInterviewStore((s) => s.clusterLabel);
  const resetSession = useInterviewStore((s) => s.resetSession);

  const handleTryAgain = () => {
    resetSession();
    router.push('/setup');
  };

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
          Week 5 — Coming Soon
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            color: 'var(--color-text-primary)',
            margin: '0 0 8px 0',
          }}
        >
          Results screen
        </h1>
        {finalScore !== null && (
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: '2rem',
              color: 'var(--color-phosphor)',
              margin: '0 0 4px 0',
            }}
          >
            {finalScore.toFixed(1)} / 10
          </p>
        )}
        {clusterLabel && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              margin: '0 0 24px 0',
              textTransform: 'capitalize',
            }}
          >
            {clusterLabel} Performer
          </p>
        )}
        <button className="btn-primary" onClick={handleTryAgain}>
          Try Again →
        </button>
      </div>
    </main>
  );
}
