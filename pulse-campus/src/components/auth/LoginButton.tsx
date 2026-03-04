"use client";

import type { User } from "@supabase/supabase-js";

interface LoginButtonProps {
  user: User | null;
  loading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function LoginButton({
  user,
  loading,
  onSignIn,
  onSignOut,
}: LoginButtonProps) {
  if (loading) {
    return (
      <div
        style={{
          height: "36px",
          width: "36px",
          borderRadius: "50%",
          background: "#FFF0E8",
        }}
      />
    );
  }

  if (!user) {
    return (
      <button
        onClick={onSignIn}
        style={{
          borderRadius: "24px",
          background: "linear-gradient(135deg, #FF6B6B, #FF9F43)",
          border: "none",
          padding: "10px 20px",
          fontSize: "13px",
          fontWeight: 600,
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(255,107,107,0.25)",
          fontFamily: "'Zen Maru Gothic', sans-serif",
        }}
      >
        ログイン
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "white",
        borderRadius: "24px",
        padding: "6px 12px 6px 6px",
        boxShadow: "0 4px 16px rgba(255,107,107,0.08)",
        border: "1.5px solid rgba(255,107,107,0.08)",
      }}
    >
      {user.user_metadata.avatar_url && (
        <img
          src={user.user_metadata.avatar_url}
          alt=""
          style={{
            height: "28px",
            width: "28px",
            borderRadius: "50%",
          }}
          referrerPolicy="no-referrer"
        />
      )}
      <button
        onClick={onSignOut}
        style={{
          borderRadius: "12px",
          background: "transparent",
          border: "none",
          padding: "2px 6px",
          fontSize: "11px",
          color: "#9B8579",
          cursor: "pointer",
          fontFamily: "'Zen Maru Gothic', sans-serif",
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
