'use client';

import type { Difficulty } from '@/types';

interface DifficultyOption {
  id: Difficulty;
  label: string;
  descriptor: string;
  accent: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    id: 'easy',
    label: 'Easy',
    descriptor: 'Concepts & definitions',
    accent: '#00ff88',
  },
  {
    id: 'medium',
    label: 'Medium',
    descriptor: 'Application & reasoning',
    accent: '#f59e0b',
  },
  {
    id: 'hard',
    label: 'Hard',
    descriptor: 'Deep knowledge & edge cases',
    accent: '#ef4444',
  },
];

interface DifficultyPickerProps {
  selected: Difficulty | null;
  onSelect: (d: Difficulty) => void;
}

export default function DifficultyPicker({ selected, onSelect }: DifficultyPickerProps) {
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
        Difficulty level
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        {DIFFICULTIES.map((d) => {
          const isSelected = selected === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              aria-pressed={isSelected}
              style={{
                flex: 1,
                background: isSelected
                  ? `rgba(${hexToRgb(d.accent)}, 0.07)`
                  : 'var(--color-surface-2)',
                border: isSelected
                  ? `1px solid ${d.accent}`
                  : '1px solid var(--color-border-2)',
                borderRadius: '10px',
                padding: '14px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
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
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isSelected ? d.accent : 'var(--color-text-primary)',
                  margin: '0 0 4px 0',
                  transition: 'color 0.15s',
                }}
              >
                {d.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--color-text-disabled)',
                  margin: 0,
                }}
              >
                {d.descriptor}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper: "#00ff88" -> "0, 255, 136"
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
