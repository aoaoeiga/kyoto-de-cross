'use client';

import { motion } from 'framer-motion';

type NarrativeScreenProps = {
  title?: string;
  content: string;
  content_en?: string;
  turn_order?: string;
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function NarrativeScreen({
  title,
  content,
  content_en,
  turn_order,
}: NarrativeScreenProps) {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0 }}
      className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center"
    >
      {title && (
        <motion.h1
          variants={fadeUp}
          className="mb-8 font-display text-2xl font-bold text-gold md:text-3xl"
        >
          {title}
        </motion.h1>
      )}

      <motion.div variants={stagger} className="max-w-md">
        {content.split('\n\n').map((paragraph, i) => (
          <motion.p
            key={i}
            variants={fadeUp}
            className="mb-5 font-narrative text-lg leading-relaxed text-text-main md:text-xl"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>

      {content_en && (
        <>
          <motion.div variants={fadeUp} className="gold-line mx-auto my-6" />
          <motion.div variants={stagger} className="max-w-md">
            {content_en.split('\n\n').map((paragraph, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="mb-3 font-sans text-sm leading-relaxed text-text-sub italic"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </>
      )}

      {turn_order && (
        <motion.p
          variants={fadeUp}
          className="mt-8 font-sans text-sm text-gold/50"
        >
          {turn_order}
        </motion.p>
      )}
    </motion.div>
  );
}
