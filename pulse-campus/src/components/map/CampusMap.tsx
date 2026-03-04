"use client";

import dynamic from "next/dynamic";
import { Pin } from "@/types";

// Leafletはブラウザ専用のため、コンポーネント全体をSSR無効で動的インポート
const CampusMapInner = dynamic(
  () => import("@/components/map/CampusMapInner"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF5F0",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #FF6B6B, #FF9F43)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "'Zen Maru Gothic', sans-serif",
            animation: "warmPulse 1.5s ease-in-out infinite",
          }}
        >
          VITA
        </span>
        <p
          style={{
            color: "#9B8579",
            fontFamily: "'Zen Maru Gothic', sans-serif",
            fontSize: "13px",
          }}
        >
          読み込み中...
        </p>
      </div>
    ),
  }
);

interface CampusMapProps {
  pins?: Pin[];
  userLat?: number;
  userLng?: number;
  myPin?: Pin | null;
  userId?: string;
  anonymousId?: string;
}

export default function CampusMap({
  pins = [],
  userLat,
  userLng,
  myPin,
  userId,
  anonymousId,
}: CampusMapProps) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <CampusMapInner
        pins={pins}
        userLat={userLat}
        userLng={userLng}
        myPin={myPin}
        userId={userId}
        anonymousId={anonymousId}
      />
    </div>
  );
}
