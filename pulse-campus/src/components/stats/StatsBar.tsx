"use client";

import { Pin } from "@/types";

interface StatsBarProps {
  pins: Pin[];
}

export default function StatsBar({ pins }: StatsBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: "22px",
        left: "22px",
        zIndex: 1000,
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 4px 20px rgba(255,107,107,0.08)",
        border: "1.5px solid rgba(255,107,107,0.08)",
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* VITAロゴ */}
      <span
        style={{
          fontSize: "18px",
          fontWeight: 700,
          background: "linear-gradient(135deg, #FF6B6B, #FF9F43)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "'Zen Maru Gothic', sans-serif",
        }}
      >
        VITA
      </span>

      {/* アクティブ人数 */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#FF6B6B",
          }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#9B8579",
            fontFamily: "'Zen Maru Gothic', sans-serif",
          }}
        >
          {pins.length}
        </span>
      </div>
    </div>
  );
}
