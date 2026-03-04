export type User = {
  id: string;
  auth_id: string;
  name: string;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  mbti?: string;
  indoor_outdoor?: 'indoor' | 'outdoor' | 'both';
  morning_night?: 'morning' | 'night' | 'both';
  current_hobby?: string;
  favorite_food?: string;
  dream_country?: string;
  biggest_worry?: string;
  future_dream?: string;
  secret?: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  host_id: string;
  title: string;
  event_date?: string;
  location?: string;
  qr_code: string;
  status: 'waiting' | 'active' | 'ended';
  created_at: string;
};

export type EventParticipant = {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
};

export type GeneratedCard = {
  id: string;
  event_id: string;
  phase: 1 | 2 | 3;
  card_number: number;
  question_ja: string;
  question_en: string;
  turn_order: 'clockwise' | 'counterclockwise' | 'voluntary';
  source_type: 'universal' | 'profile_inspired' | 'anonymous_layer2';
  created_at: string;
};

export type Feedback = {
  id: string;
  event_id: string;
  user_id: string;
  want_to_meet_again: boolean;
  memorable_card?: string;
  recommend_score: 1 | 2 | 3 | 4 | 5;
  created_at: string;
};

export type Screen = {
  id: number;
  type: 'narrative' | 'card' | 'feedback';
  phase?: 1 | 2 | 3;
  title?: string;
  content: string;
  content_en?: string;
  subtitle?: string;
  turn_order?: string;
  card_number?: number;
};

export type CardGenerationInput = {
  participants: {
    name: string;
    profile: {
      mbti?: string;
      indoor_outdoor?: string;
      morning_night?: string;
      current_hobby?: string;
      favorite_food?: string;
      dream_country?: string;
      biggest_worry?: string;
      future_dream?: string;
      secret?: string;
    };
  }[];
  participant_count: number;
};

export type GeneratedCardResponse = {
  phase: number;
  card_number: number;
  question_ja: string;
  question_en: string;
  source_type: 'universal' | 'profile_inspired' | 'anonymous_layer2';
};

export type ProfileQuestion = {
  key: keyof Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  label_ja: string;
  label_en: string;
  type: 'select' | 'text';
  options?: { value: string; label_ja: string; label_en: string }[];
  layer: 1 | 2;
  placeholder_ja?: string;
  placeholder_en?: string;
};
