"use client";

import { Pin } from "@/types";
import { MOOD_OPTIONS } from "@/lib/constants";

// TODO: 気分ピンコンポーネント（アニメーション付き）
// - 気分に応じた色とアイコンの表示
// - 出現時のパルスアニメーション
// - タップで詳細表示

interface MoodPinProps {
  pin: Pin;
}

export default function MoodPin({ pin }: MoodPinProps) {
  const mood = MOOD_OPTIONS.find((m) => m.id === pin.mood);

  if (!mood) return null;

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
      style={{ backgroundColor: mood.color }}
    >
      {/* TODO: アニメーション付きのピン表示を実装 */}
      {mood.emoji}
    </div>
  );
}
