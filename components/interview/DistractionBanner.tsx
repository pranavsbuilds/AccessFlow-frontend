'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISTRACTION_TIMEOUT_MS } from '@/lib/constants';

interface DistractionBannerProps {
  isVisible: boolean;
  distractionStartTime: number | null;
}

/**
 * DistractionBanner — animated warning banner shown when gaze leaves the screen.
 *
 * Per implementation plan:
 * - Spring animation entrance/exit (y: -80 → 0, opacity: 0 → 1)
 * - Shows countdown seconds until penalty fires
 * - distractionStartTime comes from useGazeTracker
 */
export function DistractionBanner({ isVisible, distractionStartTime }: DistractionBannerProps) {
  const [secondsUntilFlag, setSecondsUntilFlag] = useState<number | null>(null);

  useEffect(() => {
    if (!isVisible || distractionStartTime === null) {
      setSecondsUntilFlag(null);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - distractionStartTime;
      const remaining = Math.max(0, Math.ceil((DISTRACTION_TIMEOUT_MS - elapsed) / 1000));
      setSecondsUntilFlag(remaining);
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [isVisible, distractionStartTime]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="distraction-banner"
        >
          <span className="warning-icon">⚠</span>
          <span>Please focus on the screen</span>
          {secondsUntilFlag !== null && secondsUntilFlag > 0 && (
            <span className="countdown">{secondsUntilFlag}s</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
