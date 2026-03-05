'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  question_ja: string;
  question_en: string;
  card_number: number;
  phase: number;
  turn_order?: string;
  subtitle?: string;
  totalInPhase?: number;
  positionInPhase?: number;
  isFinalCard?: boolean;
};

export default function Card({
  question_ja,
  question_en,
  card_number,
  phase,
  turn_order,
  subtitle,
  totalInPhase,
  positionInPhase,
  isFinalCard,
}: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 mx-auto w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="preserve-3d relative transition-transform duration-[600ms] ease-in-out"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Card Back */}
          <div className={`backface-hidden rounded-2xl ${isFinalCard ? 'border-[3px] border-gold' : 'border-2 border-gold/50'} bg-bg-card p-8 ${isFinalCard ? 'shadow-gold-glow-intense' : 'shadow-gold-glow-strong'}`}>
            <div className="card-back-pattern absolute inset-4 rounded-xl opacity-60" />
            <div className="relative flex min-h-[400px] flex-col items-center justify-center">
              {/* Gold decorative lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              {/* Diamond decoration */}
              <div className="mb-6 h-16 w-16 rotate-45 border border-gold/30">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 -rotate-45 border border-gold/20" />
                </div>
              </div>

              <span className="font-display text-2xl font-bold text-gold">
                {isFinalCard ? 'Final Card' : card_number}
              </span>
              <div className="gold-line mx-auto mt-4" />
              <p className="mt-4 font-sans text-xs text-text-sub">
                Tap to reveal
              </p>
            </div>
          </div>

          {/* Card Front */}
          <div className={`backface-hidden rotate-y-180 absolute inset-0 rounded-2xl ${isFinalCard ? 'border-[3px] border-gold' : 'border-2 border-gold/50'} bg-bg-card p-8 ${isFinalCard ? 'shadow-gold-glow-intense' : 'shadow-gold-glow-strong'}`}>
            <div className="flex min-h-[400px] flex-col justify-between">
              {/* Top: phase indicator */}
              <div className="text-center">
                <span className="font-sans text-xs text-text-sub">
                  Phase {phase}{positionInPhase && totalInPhase ? ` \u00B7 Card ${positionInPhase}/${totalInPhase}` : ''}
                </span>
              </div>

              {/* Center: question */}
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                {isFinalCard && (
                  <span className="mb-4 font-display text-sm font-bold tracking-widest text-gold uppercase">
                    Final Card
                  </span>
                )}

                <p className="mb-4 text-center font-jp text-xl leading-relaxed text-text-main md:text-2xl">
                  {question_ja}
                </p>

                <div className="gold-line mx-auto my-4" />

                <p className="text-center font-sans text-sm leading-relaxed text-text-sub italic">
                  {question_en}
                </p>

                {subtitle && (
                  <p className="mt-4 text-center font-sans text-xs text-gold/60 italic">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Bottom: turn order */}
              <div className="text-center">
                {turn_order && (
                  <p className="font-sans text-xs text-text-sub">{turn_order}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
