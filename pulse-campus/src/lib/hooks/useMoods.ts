"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Pin, MoodType } from "@/types";
import { PIN_EXPIRY_MS } from "@/lib/constants";

function filterExpired(pins: Pin[]): Pin[] {
  const cutoff = Date.now() - PIN_EXPIRY_MS;
  return pins.filter((p) => new Date(p.created_at).getTime() > cutoff);
}

// 未ログイン時に使うブラウザ固有の匿名IDを取得・生成
function getAnonymousId(): string {
  const key = "vita_anonymous_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function useMoods(userId?: string) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  const anonymousId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return getAnonymousId();
  }, []);

  // 自分のピンを特定
  const myPin = useMemo(() => {
    return pins.find((p) => {
      if (userId && p.user_id === userId) return true;
      if (!userId && anonymousId && p.anonymous_id === anonymousId) return true;
      return false;
    }) ?? null;
  }, [pins, userId, anonymousId]);

  // 初回ロード: /api/moods からピンデータを取得
  useEffect(() => {
    async function fetchPins() {
      try {
        const res = await fetch("/api/moods");
        if (res.ok) {
          const data: Pin[] = await res.json();
          setPins(filterExpired(data));
        }
      } catch {
        // フェッチ失敗時はオフラインでも地図は表示
      } finally {
        setLoading(false);
      }
    }
    fetchPins();
  }, []);

  // Supabase Realtime で新規ピンをリアルタイム受信 + 削除も監視
  useEffect(() => {
    const channel = supabase
      .channel("pins-realtime")
      .on<Pin>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pins" },
        (payload) => {
          setPins((prev) => {
            if (prev.some((p) => p.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on<Pin>(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "pins" },
        (payload) => {
          setPins((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 期限切れピンの定期クリーンアップ（1分ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      setPins((prev) => filterExpired(prev));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ピンを投稿する関数（一人一投稿：古いピンを上書き）
  const addPin = useCallback(
    async (
      mood: MoodType,
      spotId: string,
      lat: number,
      lng: number,
      uid?: string
    ) => {
      const anonId = uid ? undefined : anonymousId;

      const res = await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          spot_id: spotId,
          latitude: lat,
          longitude: lng,
          user_id: uid,
          anonymous_id: anonId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "投稿に失敗しました");
      }

      const pin: Pin = await res.json();
      // 上書きロジック：同一ユーザー/匿名IDの古いピンを除去し新しいピンを追加
      setPins((prev) => {
        const filtered = prev.filter((p) => {
          if (uid && p.user_id === uid) return false;
          if (anonId && p.anonymous_id === anonId) return false;
          return p.id !== pin.id;
        });
        return [pin, ...filtered];
      });
      return pin;
    },
    [anonymousId]
  );

  // 自分のピンの位置を更新（50m以上移動した場合に呼ばれる）
  const updatePinLocation = useCallback(
    async (lat: number, lng: number) => {
      if (!myPin) return;

      const res = await fetch("/api/moods", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin_id: myPin.id,
          latitude: lat,
          longitude: lng,
          user_id: userId,
          anonymous_id: userId ? undefined : anonymousId,
        }),
      });

      if (!res.ok) {
        console.error("[updatePinLocation] failed:", await res.text());
        return;
      }

      const updated: Pin = await res.json();
      setPins((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    },
    [myPin, userId, anonymousId]
  );

  return { pins, loading, addPin, myPin, anonymousId, updatePinLocation };
}
