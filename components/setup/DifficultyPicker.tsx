'use client';

import React from 'react';
import type { Difficulty } from '@/types';

// Signal-bar block display for difficulty
const DIFF_BARS: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

const DIFFICULTIES: { id: Difficulty; label: string; code: string; accent: string }[] = [
  { id: 'easy',   label: 'Easy',   code: 'LVL_1', accent: '#00ff88' },
  { id: 'medium', label: 'Medium', code: 'LVL_2', accent: '#f59e0b' },
  { id: 'hard',   label: 'Hard',   code: 'LVL_3', accent: '#ef4444' },
];

interface DifficultyPickerProps {
  selected: Difficulty | null;
  onSelect: (d: Difficulty) => void;
}

export default function DifficultyPicker({ selected, onSelect }: DifficultyPickerProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  return (
    <section className="mb-28 max-w-lg mx-auto">
      {/* Section heading */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="font-mono text-sm tracking-[0.4em] text-on-surface font-bold uppercase mb-2">
          Difficulty Level
        </h2>
      </div>

      <div className="flex gap-4">
        {DIFFICULTIES.map((d) => {
          const isSelected = selected === d.id || (!selected && d.id === 'easy');
          const barCount = DIFF_BARS[d.id];
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              onMouseMove={handleMouseMove}
              aria-pressed={isSelected}
              className={`diff-card${isSelected ? ' diff-card--active' : ''}`}
              style={{
                /* accent is passed via CSS var for glow color */
                ['--diff-accent' as string]: d.accent,
              }}
              title={d.label}
            >
              {/* Mouse follow spotlight glow */}
              <div className="diff-card-glow" />

              {/* Signal bars SVG */}
              <svg
                width="32"
                height="22"
                viewBox="0 0 32 22"
                fill="none"
                aria-hidden="true"
                style={{ display: 'block', marginBottom: '8px', zIndex: 10 }}
              >
                {/* Bar 1 — always */}
                <rect
                  x="0" y="14" width="7" height="8"
                  rx="1.5"
                  fill={barCount >= 1 ? d.accent : 'rgba(255,255,255,0.15)'}
                  opacity={isSelected || barCount >= 1 ? 1 : 0.3}
                />
                {/* Bar 2 */}
                <rect
                  x="12" y="8" width="7" height="14"
                  rx="1.5"
                  fill={barCount >= 2 ? d.accent : 'rgba(255,255,255,0.15)'}
                  opacity={isSelected && barCount >= 2 ? 1 : barCount >= 2 ? 0.9 : 0.25}
                />
                {/* Bar 3 */}
                <rect
                  x="24" y="0" width="7" height="22"
                  rx="1.5"
                  fill={barCount >= 3 ? d.accent : 'rgba(255,255,255,0.15)'}
                  opacity={isSelected && barCount >= 3 ? 1 : barCount >= 3 ? 0.9 : 0.2}
                />
              </svg>

              {/* Code label */}
              <span
                className="diff-code"
                style={{
                  color: isSelected ? d.accent : '#cbd5c9',
                  textShadow: isSelected ? `0 0 10px ${d.accent}60` : 'none',
                  zIndex: 10,
                }}
              >
                {d.code}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
