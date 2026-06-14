'use client';

import { TOPICS } from '@/lib/constants';
import type { Topic } from '@/types';

// Material Symbols icon names — exactly as in S1.1
const TOPIC_ICONS: Record<string, string> = {
  machine_learning:  'psychology',
  computer_science:  'code',
  system_design:     'hub',
  data_structures:   'account_tree',
  databases:         'database',
  operating_systems: 'memory',
};

interface TopicSelectorProps {
  selected: Topic | null;
  onSelect: (topic: Topic) => void;
}

export default function TopicSelector({ selected, onSelect }: TopicSelectorProps) {
  return (
    <section className="mb-24">
      {/* Section heading */}
      <div className="flex flex-col items-center mb-16">
        <h2 className="font-mono text-sm tracking-[0.4em] text-on-surface font-bold uppercase mb-4">
          Select your field
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(126,252,157,0.5)]" />
      </div>

      {/* Circular spatial cards — 2 cols on mobile, 3 on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
        {TOPICS.map((topic) => {
          const isSelected = selected === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              aria-pressed={isSelected}
              className={`spatial-circle group scale-90 p-6${isSelected ? ' active' : ''}`}
            >
              <span
                className={`material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform group-hover:text-primary${
                  isSelected ? ' text-primary' : ' text-on-surface-variant transition-colors'
                }`}
              >
                {TOPIC_ICONS[topic.id]}
              </span>

              <span
                className={`font-headline font-bold text-2xl${
                  isSelected
                    ? ' text-on-surface'
                    : ' text-on-surface-variant group-hover:text-on-surface'
                }`}
              >
                {topic.label}
              </span>

              {isSelected && (
                <span className="text-xs font-mono mt-3 text-primary font-bold">
                  SELECTED
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
