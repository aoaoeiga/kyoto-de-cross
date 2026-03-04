// 気分の種類
export type MoodType = "talk" | "chill" | "study" | "down" | "hype" | "bored";

// 気分の選択肢
export interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string; // 日本語ラベル
  color: string; // HEXカラー
  glow: string; // rgba() グロー色
}

// 地図上に表示するピン
export interface Pin {
  id: string;
  mood: MoodType;
  spot_id: string;
  latitude: number;
  longitude: number;
  created_at: string; // ISO timestamp
  user_id?: string;
  anonymous_id?: string;
}

// キャンパス内のスポット
export interface CampusSpot {
  id: string;
  name: string;
  icon: string;
  latitude: number;
  longitude: number;
}
