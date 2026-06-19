'use client';

import { AnimatePresence, motion } from 'framer-motion';

export type FlagSeverity = 'bearable' | 'severe';

export interface FlagPopup {
  id: number;
  severity: FlagSeverity;
  title: string;
  detail: string;
}

interface FlagPopupStackProps {
  popups: FlagPopup[];
}

export function FlagPopupStack({ popups }: FlagPopupStackProps) {
  return (
    <div className="flag-popup-stack" aria-live="polite">
      <AnimatePresence initial={false}>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            className={`flag-popup flag-popup--${popup.severity}`}
            initial={{ opacity: 0, x: 18, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <span className="flag-popup__severity">
              {popup.severity === 'severe' ? 'Severe' : 'Bearable'}
            </span>
            <strong>{popup.title}</strong>
            <span>{popup.detail}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
