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
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen flex-col items-center justify-center px-6"
    >
      {/* Progress */}
      <div className="mb-8 text-sm text-gold/40">
        {currentStep} / {totalSteps}
      </div>

      {/* Layer badge */}
      {layer === 2 && (
        <div className="mb-4 rounded-full border border-gold/20 px-3 py-1 text-xs text-gold/50">
          Anonymous Layer · 匿名
        </div>
      )}

      {/* Question */}
      <h2 className="mb-2 text-center font-serif text-2xl text-white/95">
        {label_ja}
      </h2>
      <p className="mb-8 text-center text-sm text-white/40">{label_en}</p>

      {/* Input */}
      {type === 'select' && options ? (
        <div className="mb-8 grid w-full max-w-sm gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`rounded-lg border px-4 py-3 text-left transition-all ${
                value === opt.value
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/10 text-white/70 hover:border-gold/30'
              }`}
            >
              <span className="text-sm font-medium">{opt.label_ja}</span>
              <span className="ml-2 text-xs text-white/30">
                {opt.label_en}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-8 w-full max-w-sm">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder_ja || placeholder_en}
            className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white/90 placeholder:text-white/20 focus:border-gold/50 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value) onNext();
            }}
          />
          {placeholder_en && placeholder_ja && (
            <p className="mt-2 text-xs text-white/20">{placeholder_en}</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            戻る
          </Button>
        )}
        <Button onClick={onNext} disabled={!value && layer === 1}>
          {layer === 2 && !value ? 'スキップ / Skip' : '次へ / Next'}
        </Button>
      </div>
    </motion.div>
  );
}
