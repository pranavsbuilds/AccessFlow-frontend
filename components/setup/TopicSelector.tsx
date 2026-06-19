'use client';

import { TOPICS } from '@/lib/constants';
import type { Topic } from '@/types';

// Material Symbols icon names — exactly as in S1.1
const TOPIC_ICONS: Record<string, (props: React.SVGProps<SVGSVGElement>) => React.ReactNode> = {
  programming: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
      <line x1="14" y1="4" x2="10" y2="20"></line>
    </svg>
  ),
  'devops-and-cloud': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" opacity="0.3"></path>
      <path d="M2.5 12c0-2.5 2.5-4.5 5-4.5s4.5 2.5 4.5 4.5S14 16.5 16.5 16.5s5-2 5-4.5-2.5-4.5-5-4.5-4.5 2.5-4.5 4.5S9.5 7.5 7 7.5s-4.5 2-4.5 4.5z"></path>
    </svg>
  ),
  cybersecurity: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <rect x="9" y="11" width="6" height="5" rx="1"></rect>
      <path d="M10 11V9a2 2 0 0 1 4 0v2"></path>
    </svg>
  ),
  database: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"></path>
    </svg>
  ),
  python: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v8H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4v-2a2 2 0 0 1 2-2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4V2z"></path>
      <path d="M12 22v-8h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v2a2 2 0 0 1-2 2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4v2z" opacity="0.4"></path>
    </svg>
  ),
  frontend: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
      <line x1="2" y1="8" x2="22" y2="8"></line>
      <circle cx="6" cy="5.5" r="0.5" fill="currentColor"></circle>
      <circle cx="8" cy="5.5" r="0.5" fill="currentColor"></circle>
      <circle cx="10" cy="5.5" r="0.5" fill="currentColor"></circle>
    </svg>
  ),
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
          const Icon = TOPIC_ICONS[topic.id];
          return (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              aria-pressed={isSelected}
              className={`spatial-circle group scale-90 p-6${isSelected ? ' active' : ''}`}
            >
              {Icon && (
                <Icon
                  className={`w-12 h-12 mb-2 group-hover:scale-110 transition-transform group-hover:text-primary${
                    isSelected ? ' text-primary' : ' text-on-surface-variant transition-colors'
                  }`}
                />
              )}


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
