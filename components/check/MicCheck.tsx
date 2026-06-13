'use client';

import { useEffect } from 'react';
import { useMicrophone } from '@/hooks/useMicrophone';

interface MicCheckProps {
  onReady: (stream: MediaStream) => void;
}

export default function MicCheck({ onReady }: MicCheckProps) {
  const { stream, audioLevel, error, isReady } = useMicrophone();

  useEffect(() => {
    if (isReady && stream) {
      onReady(stream);
    }
  }, [isReady, stream, onReady]);

  // Build the bar segments — 20 segments, fill proportionally
  const SEGMENTS = 20;
  const activeSegments = Math.round((audioLevel / 100) * SEGMENTS);

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
            Microphone
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: '0.72rem',
            color: error
              ? 'var(--color-red)'
              : isReady
              ? audioLevel > 15
                ? 'var(--color-phosphor)'
                : 'var(--color-text-secondary)'
              : 'var(--color-text-disabled)',
          }}
        >
          {error
            ? 'Denied'
            : isReady
            ? audioLevel > 15
              ? 'Detecting audio…'
              : 'Listening…'
            : 'Requesting…'}
        </span>
      </div>

      {/* Level meter container */}
      <div
        className="card-elevated"
        style={{ padding: '20px 20px', position: 'relative' }}
      >
        {error ? (
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
        ) : (
          <>
            {/* Segment bar */}
            <div
              style={{
                display: 'flex',
                gap: '3px',
                alignItems: 'flex-end',
                height: '36px',
                marginBottom: '10px',
              }}
              role="meter"
              aria-label={`Microphone level: ${audioLevel}%`}
              aria-valuenow={audioLevel}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {Array.from({ length: SEGMENTS }, (_, i) => {
                const isActive = i < activeSegments;
                // Height varies: taller in the middle for a visual wave shape
                const heightFactor = 0.5 + 0.5 * Math.sin((i / SEGMENTS) * Math.PI);
                const segHeight = isActive
                  ? Math.max(8, heightFactor * 36)
                  : 6;

                // Colour shifts: green → amber as level approaches 100
                let color = 'var(--color-phosphor)';
                if (i > SEGMENTS * 0.75) color = 'var(--color-amber)';
                if (i > SEGMENTS * 0.9) color = 'var(--color-red)';

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${segHeight}px`,
                      borderRadius: '2px',
                      background: isActive ? color : 'var(--color-border)',
                      transition: 'height 0.06s ease, background 0.06s',
                      alignSelf: 'flex-end',
                    }}
                  />
                );
              })}
            </div>

            {/* Instruction */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: 'var(--color-text-disabled)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              {isReady
                ? 'Say something to check your microphone'
                : 'Waiting for microphone permission…'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
