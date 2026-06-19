'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * RecordingIndicator — pulsing red dot + elapsed seconds counter.
 * Only rendered when phase === 'listening' (parent controls visibility).
 * Uses Framer Motion for the pulse animation per the implementation plan.
 */
export function RecordingIndicator() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="recording-indicator">
      {/* Pulsing dot — Framer Motion per implementation plan */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="recording-dot"
      />

      <span className="recording-label">
        REC
      </span>

      <span className="recording-elapsed">
        {String(Math.floor(elapsed / 60)).padStart(2, '0')}:
        {String(elapsed % 60).padStart(2, '0')}
      </span>
    </div>
  );
}
