"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MAP_DEFAULT_CENTER, CAMPUS_SPOTS } from "@/lib/constants";

interface LocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  loading: boolean;
}

// キャンパス中心のフォールバック座標（[lng, lat] → lat, lng）
const FALLBACK_LAT = MAP_DEFAULT_CENTER[1];
const FALLBACK_LNG = MAP_DEFAULT_CENTER[0];

// Haversine距離計算（メートル単位）
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 地球半径 (m)
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: FALLBACK_LAT,
    longitude: FALLBACK_LNG,
    error: null,
    loading: true,
  });
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: FALLBACK_LAT,
        longitude: FALLBACK_LNG,
        error: "お使いのブラウザは位置情報に対応していません",
        loading: false,
      });
      return;
    }

    // watchPositionで継続的に位置を取得
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      () => {
        // 位置情報が取得できない場合はキャンパス中心をフォールバック
        setLocation((prev) =>
          prev.loading
            ? {
                latitude: FALLBACK_LAT,
                longitude: FALLBACK_LNG,
                error: null,
                loading: false,
              }
            : prev
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return location;
}

// 50m以上移動したかを判定するフック
export function useMovementDetector(
  lat: number,
  lng: number,
  onMoved: (lat: number, lng: number) => void,
  thresholdMeters = 50
) {
  const lastPatchedRef = useRef<{ lat: number; lng: number } | null>(null);
  const onMovedRef = useRef(onMoved);
  onMovedRef.current = onMoved;

  const checkMovement = useCallback(() => {
    if (!lastPatchedRef.current) {
      lastPatchedRef.current = { lat, lng };
      return;
    }
    const dist = haversineDistance(
      lastPatchedRef.current.lat,
      lastPatchedRef.current.lng,
      lat,
      lng
    );
    if (dist >= thresholdMeters) {
      lastPatchedRef.current = { lat, lng };
      onMovedRef.current(lat, lng);
    }
  }, [lat, lng, thresholdMeters]);

  useEffect(() => {
    checkMovement();
  }, [checkMovement]);

  // 投稿時にlastPatchedRefをリセットするための関数
  const resetPosition = useCallback((newLat: number, newLng: number) => {
    lastPatchedRef.current = { lat: newLat, lng: newLng };
  }, []);

  return { resetPosition };
}

// 最寄りのキャンパススポットを返す
export function findNearestSpot(lat: number, lng: number): string {
  let nearestId = CAMPUS_SPOTS[0].id;
  let minDist = Infinity;

  for (const spot of CAMPUS_SPOTS) {
    const d = (spot.latitude - lat) ** 2 + (spot.longitude - lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearestId = spot.id;
    }
  }

  return nearestId;
}
