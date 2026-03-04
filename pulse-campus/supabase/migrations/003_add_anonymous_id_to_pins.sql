-- pinsテーブルにanonymous_idカラムを追加（未ログインユーザー識別用）
ALTER TABLE public.pins ADD COLUMN IF NOT EXISTS anonymous_id text;

-- anonymous_idのインデックス
CREATE INDEX IF NOT EXISTS idx_pins_anonymous_id ON public.pins (anonymous_id);

-- RLSポリシーを再設定（全ユーザーがINSERT/DELETE可能）
DROP POLICY IF EXISTS "Anyone can insert pins" ON public.pins;
DROP POLICY IF EXISTS "Authenticated users can insert pins" ON public.pins;
DROP POLICY IF EXISTS "Users can delete own pins" ON public.pins;

CREATE POLICY "Anyone can insert pins"
  ON public.pins FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete pins"
  ON public.pins FOR DELETE
  USING (true);
