import { MoodOption, CampusSpot } from "@/types";

// 気分の種類（6種類）
export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "talk",
    emoji: "\u{1F4AC}",
    label: "話したい",
    color: "#FF6B6B",
    glow: "rgba(255, 107, 107, 0.4)",
  },
  {
    id: "chill",
    emoji: "\u2615",
    label: "まったり",
    color: "#FECA57",
    glow: "rgba(254, 202, 87, 0.4)",
  },
  {
    id: "study",
    emoji: "\u{1F4DA}",
    label: "集中中",
    color: "#FF9F43",
    glow: "rgba(255, 159, 67, 0.4)",
  },
  {
    id: "down",
    emoji: "\u{1F327}\uFE0F",
    label: "落ち込み",
    color: "#DDA0DD",
    glow: "rgba(221, 160, 221, 0.4)",
  },
  {
    id: "hype",
    emoji: "\u{1F525}",
    label: "テンション高",
    color: "#FF4757",
    glow: "rgba(255, 71, 87, 0.4)",
  },
  {
    id: "bored",
    emoji: "\u{1F4A4}",
    label: "暇すぎ",
    color: "#FFB8B8",
    glow: "rgba(255, 184, 184, 0.4)",
  },
];

// 京都産業大学キャンパススポット（仮の座標、後で調整）
export const CAMPUS_SPOTS: CampusSpot[] = [
  {
    id: "cafeteria",
    name: "食堂",
    icon: "\u{1F37D}\uFE0F",
    latitude: 35.0762,
    longitude: 135.757,
  },
  {
    id: "library",
    name: "図書館",
    icon: "\u{1F4D6}",
    latitude: 35.0765,
    longitude: 135.7575,
  },
  {
    id: "lounge",
    name: "ラウンジ",
    icon: "\u{1F6CB}\uFE0F",
    latitude: 35.0768,
    longitude: 135.758,
  },
  {
    id: "gym",
    name: "体育館",
    icon: "\u{1F3C0}",
    latitude: 35.0755,
    longitude: 135.756,
  },
  {
    id: "main-gate",
    name: "正門前",
    icon: "\u{1F6AA}",
    latitude: 35.075,
    longitude: 135.7565,
  },
  {
    id: "courtyard",
    name: "中庭",
    icon: "\u{1F333}",
    latitude: 35.076,
    longitude: 135.7572,
  },
  {
    id: "pc-room",
    name: "PC教室",
    icon: "\u{1F4BB}",
    latitude: 35.0763,
    longitude: 135.7578,
  },
  {
    id: "cafe",
    name: "カフェ",
    icon: "\u2615",
    latitude: 35.0758,
    longitude: 135.7568,
  },
];

// 地図の初期表示設定（京都産業大学付近）
export const MAP_DEFAULT_CENTER: [number, number] = [135.7572, 35.076];
export const MAP_DEFAULT_ZOOM = 16;

// ピンの有効期間（ミリ秒）: 2時間
export const PIN_EXPIRY_MS = 2 * 60 * 60 * 1000;
