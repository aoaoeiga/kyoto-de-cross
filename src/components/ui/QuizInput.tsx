'use client';

import { motion } from 'framer-motion';
import Button from './Button';

type QuizInputProps = {
  label_ja: string;
  label_en: string;
  type: 'select' | 'text';
  options?: { value: string; label_ja: string; label_en: string }[];
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  placeholder_ja?: string;
  placeholder_en?: string;
  layer: 1 | 2;
  currentStep: number;
  totalSteps: number;
};

export default function QuizInput({
  label_ja,
  label_en,
  type,
  options,
  value,
  onChange,
  onNext,
  onBack,
  placeholder_ja,
  placeholder_en,
  layer,
  currentStep,
  totalSteps,
}: QuizInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6"
    >
      {/* Step counter */}
      <div className="absolute top-6 right-6 font-sans text-sm text-gold/40">
        {currentStep}/{totalSteps}
      </div>

      {/* Anonymous layer badge */}
      {layer === 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-gold/20 bg-white/5 px-4 py-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/50">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="font-sans text-xs text-gold/50">
            匿名で共有 / Shared anonymously
          </span>
        </motion.div>
      )}

      {/* Question */}
      <h2 className="mb-2 text-center font-display text-2xl font-bold text-text-main md:text-3xl">
        {label_ja}
      </h2>
      <p className="mb-10 text-center font-sans text-sm text-text-sub">
        {label_en}
      </p>

      {/* Input area */}
      {type === 'select' && options ? (
        <div className="mb-10 grid w-full max-w-sm gap-3">
          {options.map((opt) => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                value === opt.value
                  ? 'border-gold bg-gold/10 shadow-gold-glow'
                  : 'border-white/10 bg-bg-card hover:border-gold/30'
              }`}
            >
              <span className={`font-sans text-sm font-medium ${value === opt.value ? 'text-gold' : 'text-text-main'}`}>
                {opt.label_ja}
              </span>
              <span className="ml-2 font-sans text-xs text-text-sub">
                {opt.label_en}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="mb-10 w-full max-w-sm">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder_ja || placeholder_en}
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value) onNext();
            }}
          />
          {placeholder_en && placeholder_ja && (
            <p className="mt-2 px-1 font-sans text-xs text-text-sub">
              {placeholder_en}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" onClick={onBack} size="md">
            戻る
          </Button>
        )}
        <Button onClick={onNext} disabled={!value && layer === 1} size="lg">
          {layer === 2 && !value ? 'スキップ / Skip' : '次へ / Next'}
        </Button>
      </div>
    </motion.div>
  );
}
