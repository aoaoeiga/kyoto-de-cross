"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, MOOD_OPTIONS } from "@/lib/constants";
import { Pin } from "@/types";

// Leafletのデフォルトアイコンをモジュールレベルで即座に設定
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// MAP_DEFAULT_CENTERは [lng, lat] 形式なので、Leaflet用に [lat, lng] に変換
const defaultCenter: [number, number] = [MAP_DEFAULT_CENTER[1], MAP_DEFAULT_CENTER[0]];

// ウォームポップデザインのぷっくりピンアイコン
function createMoodIcon(emoji: string, color: string, isMine: boolean): L.DivIcon {
  const totalHeight = 60;
  const pinSize = 50;
  const animClass = isMine ? "pin-float-mine" : "pin-float";

  return L.divIcon({
    html: `<div class="${animClass}" style="
      display:flex;flex-direction:column;align-items:center;
    ">
      <div style="
        width:${pinSize}px;height:${pinSize}px;
        background: linear-gradient(145deg, white, #FFF5F0);
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:26px;
        box-shadow: 0 6px 20px ${color}30, 0 2px 6px rgba(0,0,0,0.06);
        border: 2.5px solid ${color}60;
      ">${emoji}</div>
      <div style="
        width:14px;height:5px;
        background:rgba(0,0,0,0.06);
        border-radius:50%;
        margin-top:3px;
        filter:blur(2px);
      "></div>
    </div>`,
    className: "",
    iconSize: [pinSize, totalHeight],
    iconAnchor: [pinSize / 2, totalHeight / 2],
    popupAnchor: [0, -(totalHeight / 2)],
  });
}

// 現在地マーカー（暖色グラデーション）
const currentLocationIcon = L.divIcon({
  html: `<div style="
    display:flex;flex-direction:column;align-items:center;
  ">
    <div class="location-pulse" style="
      width:20px;height:20px;
      background: linear-gradient(135deg, #FF6B6B, #FF9F43);
      border-radius:50%;
      border:3px solid white;
      box-shadow: 0 2px 12px rgba(255,107,107,0.4);
    "></div>
  </div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

// ユーザーの現在地に地図を移動するコンポーネント（初回のみ flyTo）
function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const hasFlewRef = useRef(false);
  useEffect(() => {
    if (!hasFlewRef.current && (lat !== defaultCenter[0] || lng !== defaultCenter[1])) {
      map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 });
      hasFlewRef.current = true;
    }
  }, [lat, lng, map]);
  return null;
}

interface CampusMapInnerProps {
  pins?: Pin[];
  userLat?: number;
  userLng?: number;
  myPin?: Pin | null;
  userId?: string;
  anonymousId?: string;
}

export default function CampusMapInner({
  pins = [],
  userLat,
  userLng,
  myPin,
  userId,
  anonymousId,
}: CampusMapInnerProps) {
  // 自分のピンかどうかの判定
  const isMyPin = (pin: Pin) => {
    if (userId && pin.user_id === userId) return true;
    if (!userId && anonymousId && pin.anonymous_id === anonymousId) return true;
    return false;
  };

  // 他人のピン（自分のピンを除外）
  const otherPins = pins.filter((p) => !isMyPin(p));

  // 自分のピンの気分情報
  const myMood = myPin ? MOOD_OPTIONS.find((m) => m.id === myPin.mood) : null;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={MAP_DEFAULT_ZOOM}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* ユーザーの現在地があれば地図を移動 */}
      {userLat !== undefined && userLng !== undefined && (
        <FlyToLocation lat={userLat} lng={userLng} />
      )}

      {/* 現在地マーカー: 投稿前→グラデーション丸、投稿後→気分絵文字 */}
      {userLat !== undefined && userLng !== undefined && (
        myMood ? (
          <Marker
            key={`my-pin-${myPin!.id}`}
            position={[userLat, userLng]}
            icon={createMoodIcon(myMood.emoji, myMood.color, true)}
            zIndexOffset={1000}
          >
            <Popup>
              <div style={{ textAlign: "center", fontFamily: "'Zen Maru Gothic', sans-serif" }}>
                <span style={{ fontSize: 28 }}>{myMood.emoji}</span>
                <p style={{ fontSize: 14, fontWeight: 600, margin: "4px 0 0", color: myMood.color }}>
                  {myMood.label}
                </p>
                <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>あなた</p>
              </div>
            </Popup>
          </Marker>
        ) : (
          <Marker
            position={[userLat, userLng]}
            icon={currentLocationIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <div style={{ textAlign: "center", fontFamily: "'Zen Maru Gothic', sans-serif" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#FF6B6B" }}>あなたの現在地</p>
              </div>
            </Popup>
          </Marker>
        )
      )}

      {/* 他人の気分ピン（投稿された位置に表示） */}
      {otherPins.map((pin) => {
        const mood = MOOD_OPTIONS.find((m) => m.id === pin.mood);
        if (!mood) return null;
        return (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={createMoodIcon(mood.emoji, mood.color, false)}
          >
            <Popup>
              <div style={{ textAlign: "center", fontFamily: "'Zen Maru Gothic', sans-serif" }}>
                <span style={{ fontSize: 28 }}>{mood.emoji}</span>
                <p style={{ fontSize: 14, fontWeight: 600, margin: "4px 0 0", color: mood.color }}>
                  {mood.label}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
