"use client";

import { useCallback } from "react";
import CampusMap from "@/components/map/CampusMap";
import MoodSelector from "@/components/mood/MoodSelector";
import LiveFeed from "@/components/feed/LiveFeed";
import StatsBar from "@/components/stats/StatsBar";
import LoginButton from "@/components/auth/LoginButton";
import { useMoods } from "@/lib/hooks/useMoods";
import { useLocation, useMovementDetector, findNearestSpot } from "@/lib/hooks/useLocation";
import { useAuth } from "@/lib/hooks/useAuth";
import { MoodType } from "@/types";

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { pins, addPin, myPin, anonymousId, updatePinLocation } = useMoods(user?.id);
  const { latitude, longitude } = useLocation();

  // 50m以上移動したら自分のピンの位置をPATCHで更新
  useMovementDetector(latitude, longitude, updatePinLocation);

  const handleMoodSelect = useCallback(
    async (mood: MoodType) => {
      const spotId = findNearestSpot(latitude, longitude);
      await addPin(mood, spotId, latitude, longitude, user?.id);
    },
    [latitude, longitude, addPin, user]
  );

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#FFF5F0" }}>
      {/* 全画面地図（角丸カード風） */}
      <div
        style={{
          position: "fixed",
          inset: "10px",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(255,107,107,0.08), 0 2px 12px rgba(0,0,0,0.04)",
          border: "2px solid rgba(255,107,107,0.08)",
          background: "white",
        }}
      >
        <CampusMap
          pins={pins}
          userLat={latitude}
          userLng={longitude}
          myPin={myPin}
          userId={user?.id}
          anonymousId={anonymousId}
        />
      </div>

      {/* 左上: StatsBar（コンパクトなピル） */}
      <StatsBar pins={pins} />

      {/* 右上: LoginButton（フィードボタンの左） */}
      <div
        style={{
          position: "fixed",
          top: "22px",
          right: "74px",
          zIndex: 1000,
        }}
      >
        <LoginButton
          user={user}
          loading={authLoading}
          onSignIn={signInWithGoogle}
          onSignOut={signOut}
        />
      </div>

      {/* 右上: LiveFeed（ボトムシート） */}
      <LiveFeed pins={pins} />

      {/* 下部: MoodSelector（フローティングカプセル） */}
      <MoodSelector
        onSelect={handleMoodSelect}
        currentMood={myPin?.mood ?? null}
      />
    </div>
  );
}
