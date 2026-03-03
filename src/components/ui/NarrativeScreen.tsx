'use client';

import { motion } from 'framer-motion';

type NarrativeScreenProps = {
  title?: string;
  content: string;
  content_en?: string;
  turn_order?: string;
};

export default function NarrativeScreen({
  title,
  content,
  content_en,
  turn_order,
}: NarrativeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 font-serif text-2xl text-gold"
        >
          {title}
        </motion.h1>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="max-w-md"
      >
        {content.split('\n\n').map((paragraph, i) => (
          <p
            key={i}
            className="mb-4 font-serif text-lg leading-relaxed text-white/90"
          >
            {paragraph}
          </p>
        ))}
      </motion.div>

      {content_en && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-4 max-w-md"
        >
          {content_en.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className="mb-3 text-sm leading-relaxed text-white/35"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>
      )}

      {turn_order && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-sm text-gold/50"
        >
          {turn_order}
        </motion.p>
      )}
    </motion.div>
  );
}
