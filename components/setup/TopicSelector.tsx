'use client';

import { TOPICS } from '@/lib/constants';
import type { Topic } from '@/types';

interface TopicSelectorProps {
  selected: Topic | null;
  onSelect: (topic: Topic) => void;
}

export default function TopicSelector({ selected, onSelect }: TopicSelectorProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          marginBottom: '12px',
        }}
      >
        Select your field
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {TOPICS.map((topic) => {
          const isSelected = selected === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              aria-pressed={isSelected}
              style={{
                background: isSelected
                  ? 'rgba(0,255,136,0.07)'
                  : 'var(--color-surface-2)',
                border: isSelected
                  ? '1px solid var(--color-phosphor)'
                  : '1px solid var(--color-border-2)',
                borderRadius: '10px',
                padding: '16px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'var(--color-text-disabled)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'var(--color-border-2)';
                }
              }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-phosphor)',
                    boxShadow: '0 0 6px var(--color-phosphor)',
                  }}
                />
              )}

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: isSelected
                    ? 'var(--color-phosphor)'
                    : 'var(--color-text-primary)',
                  margin: '0 0 5px 0',
                  transition: 'color 0.15s',
                }}
              >
                {topic.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-disabled)',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {topic.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
