'use client';

import { motion } from 'framer-motion';

type PhaseIntroProps = {
  phase: number;
  content: string;
  content_en?: string;
};

const phaseNames: Record<number, { ja: string; en: string }> = {
  1: { ja: '心を開く', en: 'Opening Hearts' },
  2: { ja: '価値観を知る', en: 'Discovering Values' },
  3: { ja: '深く繋がる', en: 'Deep Connection' },
};

export default function PhaseIntro({ phase, content, content_en }: PhaseIntroProps) {
  const glowClass = phase === 1 ? 'phase-glow-1' : phase === 2 ? 'phase-glow-2' : 'phase-glow-3';

  return (
    <div className={`flex min-h-[80vh] flex-col items-center justify-center px-8 ${glowClass}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="glass rounded-2xl px-10 py-12 text-center max-w-md w-full"
      >
        {/* Gold decorative line top */}
        <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Phase number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="font-display text-6xl font-bold text-gold">
            {phase}
          </span>
        </motion.div>

        {/* Phase title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4"
        >
          <h2 className="font-display text-2xl font-bold text-gold">
            Phase {phase}
          </h2>
          {phaseNames[phase] && (
            <>
              <p className="mt-2 font-jp text-lg text-text-main">
                {phaseNames[phase].ja}
              </p>
              <p className="mt-1 font-sans text-sm text-text-sub italic">
                {phaseNames[phase].en}
              </p>
            </>
          )}
        </motion.div>

        {/* Divider */}
        <div className="gold-line mx-auto my-6" />

        {/* Content */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="font-narrative text-lg leading-relaxed text-text-main"
        >
          {content}
        </motion.p>

        {content_en && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-4 font-sans text-sm leading-relaxed text-text-sub italic"
          >
            {content_en}
          </motion.p>
        )}

        {/* Gold decorative line bottom */}
        <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </motion.div>
    </div>
  );
}
