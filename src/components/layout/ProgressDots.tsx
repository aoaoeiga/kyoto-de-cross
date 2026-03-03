'use client';

type ProgressDotsProps = {
  total: number;
  current: number;
  phase?: number;
};

export default function ProgressDots({ total, current, phase }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {phase !== undefined && (
        <span className="mr-2 text-xs text-gold/30">P{phase}</span>
      )}
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-4 bg-gold'
              : i < current
              ? 'w-1.5 bg-gold/30'
              : 'w-1.5 bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}
