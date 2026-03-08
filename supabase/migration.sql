-- Kyoto de Cross MVP - Database Schema
-- Run this in your Supabase SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Layer 1 (always shared)
  mbti TEXT,
  one_word TEXT, -- 自分を一言で表現
  indoor_outdoor TEXT, -- 'indoor' | 'outdoor' | 'both'
  morning_night TEXT, -- 'morning' | 'night' | 'both'
  current_hobby TEXT,
  favorite_food TEXT,
  dream_country TEXT,
  -- Layer 2 (anonymous, optional)
  biggest_worry TEXT,
  future_dream TEXT,
  secret TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id),
  title TEXT NOT NULL DEFAULT 'Kyoto de Cross',
  event_date TIMESTAMPTZ,
  location TEXT,
  qr_code TEXT UNIQUE, -- short code for QR join
  status TEXT DEFAULT 'waiting', -- 'waiting' | 'active' | 'ended'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Generated cards table
CREATE TABLE IF NOT EXISTS generated_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL, -- 1, 2, 3
  card_number INTEGER NOT NULL,
  question_ja TEXT NOT NULL,
  question_en TEXT NOT NULL,
  turn_order TEXT NOT NULL, -- 'clockwise' | 'counterclockwise' | 'voluntary'
  source_type TEXT NOT NULL, -- 'universal' | 'profile_inspired' | 'anonymous_layer2'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  want_to_meet_again BOOLEAN,
  memorable_card TEXT,
  recommend_score INTEGER, -- 1-5
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies: users can read/write their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Profiles: users can manage their own profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Events: anyone authenticated can view events, hosts can manage
CREATE POLICY "Authenticated users can view events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (
    host_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Hosts can update events" ON events
  FOR UPDATE USING (
    host_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Event participants: anyone can view, participants can join
CREATE POLICY "Authenticated users can view participants" ON event_participants
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join events" ON event_participants
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Generated cards: participants can view cards for their events
CREATE POLICY "Participants can view event cards" ON generated_cards
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service can insert cards" ON generated_cards
  FOR INSERT WITH CHECK (true);

-- Feedback: users can submit and view own feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can insert feedback" ON feedback
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );
