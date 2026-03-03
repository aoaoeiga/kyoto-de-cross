'use client';

import { motion } from 'framer-motion';

type CardProps = {
  question_ja: string;
  question_en: string;
  card_number: number;
  phase: number;
  turn_order?: string;
  subtitle?: string;
};

export default function Card({
  question_ja,
  question_en,
  card_number,
  phase,
  turn_order,
  subtitle,
}: CardProps) {
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-sm"
    >
      {/* Tarot-style card */}
      <div className="relative rounded-2xl border-2 border-gold/60 bg-gradient-to-b from-navy-light to-navy p-8 shadow-[0_0_30px_rgba(201,148,62,0.15)]">
        {/* Top decorative border */}
        <div className="absolute top-3 left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-3 bottom-3 left-3 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-3 bottom-3 right-3 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

        {/* Card number */}
        <div className="mb-6 text-center">
          <span className="font-serif text-sm text-gold/50">
            Card {card_number} · Phase {phase}
          </span>
        </div>

        {/* Question - Japanese */}
        <p className="mb-4 text-center font-serif text-xl leading-relaxed text-white/95">
          {question_ja}
        </p>

        {/* Question - English */}
        <p className="mb-6 text-center text-sm leading-relaxed text-white/50">
          {question_en}
        </p>

        {/* Subtitle if present */}
        {subtitle && (
          <p className="mb-4 text-center text-xs italic text-gold/60">
            {subtitle}
          </p>
        )}

        {/* Divider */}
        <div className="mx-auto mb-4 h-px w-16 bg-gold/30" />

        {/* Turn order */}
        {turn_order && (
          <p className="text-center text-xs text-gold/40">{turn_order}</p>
        )}
      </div>
    </motion.div>
  );
}
