import MotivationalQuote from '@/components/setup/MotivationalQuote';
import SetupForm from './SetupForm';

// SSR page — quote is server-rendered, form hydrates on client
export default function SetupPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'var(--color-void)',
        position: 'relative',
      }}
    >
      {/* Background texture — very subtle grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(0,255,136,0.025) 0%, transparent 60%), ' +
            'radial-gradient(circle at 80% 20%, rgba(0,255,136,0.015) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-phosphor)',
                background: 'rgba(0,255,136,0.08)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(0,255,136,0.2)',
              }}
            >
              Smart Interviewer
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: '0 0 8px 0',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Set up your interview
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            10 adaptive questions. Scored on accuracy, not filler.
          </p>
        </div>

        {/* Quote — server-rendered */}
        <MotivationalQuote />

        {/* Setup form — client-side (topic picker, difficulty, start button) */}
        <SetupForm />
      </div>
    </main>
  );
}
