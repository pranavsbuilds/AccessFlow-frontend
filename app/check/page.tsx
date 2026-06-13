'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CameraCheck from '@/components/check/CameraCheck';
import MicCheck from '@/components/check/MicCheck';
import { useInterviewStore } from '@/store/interviewStore';

export default function CheckPage() {
  const router = useRouter();
  const sessionId = useInterviewStore((s) => s.sessionId);

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/setup');
    }
  }, [sessionId, router]);

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  const handleMicReady = useCallback(() => {
    setMicReady(true);
  }, []);

  if (!sessionId) {
    return null;
  }

  const bothReady = cameraReady && micReady;

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
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 40%, rgba(0,255,136,0.02) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <button
            onClick={() => router.push('/setup')}
            className="btn-ghost"
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              marginBottom: '20px',
              gap: '6px',
            }}
            aria-label="Go back to setup"
          >
            ← Back
          </button>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
            }}
          >
            System check
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Camera and microphone must be active before the interview starts.
          </p>
        </div>

        {/* Checks */}
        <div
          className="card"
          style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}
        >
          <CameraCheck onReady={handleCameraReady} />

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          <MicCheck onReady={handleMicReady} />
        </div>

        {/* Status summary + Continue */}
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Checklist */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            <CheckItem label="Camera" done={cameraReady} />
            <CheckItem label="Microphone" done={micReady} />
          </div>

          <button
            className="btn-primary"
            onClick={() => router.push('/interview')}
            disabled={!bothReady}
            style={{ width: '100%', padding: '14px' }}
            aria-label={
              bothReady
                ? 'Continue to interview'
                : 'Waiting for camera and microphone'
            }
          >
            {bothReady ? 'Enter Interview →' : 'Waiting for permissions…'}
          </button>

          {!bothReady && (
            <p
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--color-text-disabled)',
                margin: 0,
              }}
            >
              Both camera and microphone must be active to continue
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function CheckItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: `1.5px solid ${done ? 'var(--color-phosphor)' : 'var(--color-border-2)'}`,
          background: done ? 'rgba(0,255,136,0.1)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="var(--color-phosphor)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: done ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
          transition: 'color 0.2s',
        }}
      >
        {label}
      </span>
    </div>
  );
}
