"use client";

import { CampusSpot } from "@/types";

// TODO: キャンパススポットのマーカーコンポーネント
// - スポットのアイコンと名前を表示
// - タップでスポット情報を表示

interface SpotMarkerProps {
  spot: CampusSpot;
}

export default function SpotMarker({ spot }: SpotMarkerProps) {
  return (
    <div className="flex flex-col items-center">
      {/* TODO: スポットマーカーのデザインを実装 */}
      <span className="text-2xl">{spot.icon}</span>
      <span className="mt-1 rounded bg-white/80 px-1 text-xs font-medium text-gray-700">
        {spot.name}
      </span>
    </div>
  );
}
