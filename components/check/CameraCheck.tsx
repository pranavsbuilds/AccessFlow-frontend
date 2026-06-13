'use client';

import { useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';

interface CameraCheckProps {
  onReady: (stream: MediaStream) => void;
}

export default function CameraCheck({ onReady }: CameraCheckProps) {
  const { stream, videoRef, error, isReady } = useCamera();

  useEffect(() => {
    if (isReady && stream) {
      onReady(stream);
    }
  }, [isReady, stream, onReady]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className={`status-dot ${error ? 'error' : isReady ? 'ready' : 'waiting'}`}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            Camera
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: '0.72rem',
            color: error
              ? 'var(--color-red)'
              : isReady
              ? 'var(--color-phosphor)'
              : 'var(--color-text-disabled)',
          }}
        >
          {error ? 'Denied' : isReady ? 'Ready' : 'Requesting…'}
        </span>
      </div>

      {/* Camera preview */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '10px',
          overflow: 'hidden',
          background: 'var(--color-surface-2)',
          border: `1px solid ${
            error
              ? 'rgba(239,68,68,0.4)'
              : isReady
              ? 'rgba(0,255,136,0.2)'
              : 'var(--color-border-2)'
          }`,
        }}
      >
        {/* Live video feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)', // Mirror — feels natural for self-view
            display: isReady ? 'block' : 'none',
          }}
        />

        {/* Placeholder while requesting / error */}
        {!isReady && !error && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <CameraIcon />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--color-text-disabled)',
                margin: 0,
              }}
            >
              Requesting camera access…
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '24px',
            }}
          >
            <CameraOffIcon />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--color-red)',
                textAlign: 'center',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Ready overlay — corner indicator */}
        {isReady && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              className="status-dot ready"
              style={{ width: '6px', height: '6px' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: '0.68rem',
                color: 'var(--color-phosphor)',
              }}
            >
              LIVE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-disabled)" strokeWidth="1.5">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" strokeWidth="1.5">
      <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
