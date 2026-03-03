'use client';

import { motion } from 'framer-motion';

type PhaseIntroProps = {
  phase: number;
  content: string;
  content_en?: string;
};

export default function PhaseIntro({ phase, content, content_en }: PhaseIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30"
      >
        <span className="font-serif text-2xl text-gold">{phase}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6 font-serif text-xl text-gold"
      >
        Phase {phase}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-4 max-w-md font-serif text-lg leading-relaxed text-white/90"
      >
        {content}
      </motion.p>

      {content_en && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="max-w-md text-sm leading-relaxed text-white/35"
        >
          {content_en}
        </motion.p>
      )}
    </motion.div>
  );
}
