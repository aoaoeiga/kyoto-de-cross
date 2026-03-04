"use client";

import { useState } from "react";
import { Pin } from "@/types";
import { MOOD_OPTIONS } from "@/lib/constants";
import { timeAgo } from "@/utils/time";

interface LiveFeedProps {
  pins: Pin[];
}

export default function LiveFeed({ pins }: LiveFeedProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* トグルボタン（右上のまる） */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: "22px",
          right: "22px",
          zIndex: 1001,
          width: "42px",
          height: "42px",
          background: "white",
          border: "none",
          borderRadius: "50%",
          boxShadow: "0 4px 16px rgba(255,107,107,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#FF6B6B",
        }}
      >
        {isOpen ? "✕" : "📋"}
      </button>

      {/* オーバーレイ背景 */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1001,
            background: "rgba(0,0,0,0.15)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* サイドシート */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 1002,
            width: "300px",
            height: "50vh",
            background: "white",
            borderRadius: "24px 0 0 0",
            boxShadow: "-4px 0 24px rgba(255,107,107,0.06)",
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* ハンドル */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div
              style={{
                width: "36px",
                height: "4px",
                borderRadius: "2px",
                background: "#FFD4C8",
              }}
            />
          </div>

          {/* ヘッダー */}
          <div style={{ padding: "4px 20px 12px" }}>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#4A3728",
                margin: 0,
                fontFamily: "'Zen Maru Gothic', sans-serif",
              }}
            >
              最近の投稿
            </h3>
          </div>

          {/* フィードリスト */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 20px 20px",
            }}
          >
            {pins.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#D4A89A",
                  fontSize: "13px",
                  marginTop: "24px",
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                }}
              >
                まだ投稿がありません
              </p>
            ) : (
              pins.map((pin) => {
                const mood = MOOD_OPTIONS.find((m) => m.id === pin.mood);
                if (!mood) return null;
                return (
                  <div
                    key={pin.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 0",
                      borderBottom: "1px solid #FFF0E8",
                    }}
                  >
                    {/* 絵文字 */}
                    <span style={{ fontSize: "20px" }}>{mood.emoji}</span>

                    {/* 時間 */}
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#9B8579",
                        fontFamily: "'Zen Maru Gothic', sans-serif",
                        marginLeft: "auto",
                      }}
                    >
                      {timeAgo(pin.created_at)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
