// Server component — quote is baked in at request time, no client JS needed

import { MOTIVATIONAL_QUOTES } from '@/lib/constants';

function getDailyQuote() {
  // Use the day of year so the quote changes daily, not per-request
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

export default function MotivationalQuote() {
  const quote = getDailyQuote();

  return (
    <div
      style={{
        borderLeft: '2px solid var(--color-phosphor)',
        paddingLeft: '16px',
        marginBottom: '40px',
        opacity: 0.8,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        &ldquo;{quote.text}&rdquo;
      </p>
      {quote.author && (
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            color: 'var(--color-text-disabled)',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          — {quote.author}
        </p>
      )}
    </div>
  );
}
