-- pinsテーブルにuser_idカラムを追加
ALTER TABLE public.pins ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- user_idのインデックス
CREATE INDEX IF NOT EXISTS idx_pins_user_id ON public.pins (user_id);
