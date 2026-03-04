"use client";

import { useState } from "react";
import { MoodType } from "@/types";
import { MOOD_OPTIONS } from "@/lib/constants";

interface MoodSelectorProps {
  onSelect: (mood: MoodType) => Promise<void>;
  disabled?: boolean;
  currentMood?: MoodType | null;
}

export default function MoodSelector({ onSelect, disabled, currentMood }: MoodSelectorProps) {
  const [posting, setPosting] = useState(false);
  const [tappedMood, setTappedMood] = useState<MoodType | null>(null);

  const handleClick = async (mood: MoodType) => {
    if (posting) return;
    setPosting(true);
    setTappedMood(mood);
    try {
      await onSelect(mood);
    } catch {
      // エラーは親で処理
    } finally {
      setPosting(false);
      setTimeout(() => setTappedMood(null), 300);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "400px",
        zIndex: 1000,
        background: "white",
        borderRadius: "32px",
        boxShadow: "0 8px 32px rgba(255,107,107,0.1), 0 2px 8px rgba(0,0,0,0.04)",
        border: "1.5px solid rgba(255,107,107,0.1)",
        padding: "14px 16px 26px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {MOOD_OPTIONS.map((mood) => {
        const isActive = currentMood === mood.id;
        const isTapped = tappedMood === mood.id;

        return (
          <button
            key={mood.id}
            onClick={() => handleClick(mood.id)}
            disabled={disabled || posting}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              border: "none",
              background: "transparent",
              cursor: disabled || posting ? "not-allowed" : "pointer",
              opacity: disabled || posting ? 0.5 : 1,
              transform: isTapped ? "scale(1.2)" : isActive ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              padding: 0,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: isTapped
                  ? `${mood.color}20`
                  : `${mood.color}12`,
                border: isTapped
                  ? `2px solid ${mood.color}`
                  : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {mood.emoji}
            </div>
            {/* 選択中ドット */}
            {isActive && (
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: mood.color,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
