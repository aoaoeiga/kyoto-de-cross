'use client';

import { Screen } from '@/lib/types';

type ProgressDotsProps = {
  total: number;
  current: number;
  phase?: number;
  screens?: Screen[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProgressDots({ total, current, phase, screens }: ProgressDotsProps) {
  // Group dots by phase for subtle spacing
  const getPhaseForIndex = (i: number) => screens?.[i]?.phase;

  return (
    <div className="flex items-center justify-center gap-[3px] px-4">
      {Array.from({ length: total }, (_, i) => {
        const prevPhase = i > 0 ? getPhaseForIndex(i - 1) : undefined;
        const currentPhase = getPhaseForIndex(i);
        const hasPhaseGap = screens && prevPhase !== currentPhase && i > 0;

        return (
          <div key={i} className={`flex items-center ${hasPhaseGap ? 'ml-1.5' : ''}`}>
            <div
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'h-2 w-2 bg-gold'
                  : i < current
                  ? 'h-1.5 w-1.5 bg-gold/40'
                  : 'h-1.5 w-1.5 bg-white/10'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
