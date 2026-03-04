-- ピンテーブルの作成
create table public.pins (
  id uuid default gen_random_uuid() primary key,
  mood text not null check (mood in ('talk', 'chill', 'study', 'down', 'hype', 'bored')),
  spot_id text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz default now() not null
);

-- 2時間以上古いピンを自動削除するためのインデックス
create index idx_pins_created_at on public.pins (created_at);

-- Realtimeを有効化
alter publication supabase_realtime add table public.pins;

-- RLS（Row Level Security）
alter table public.pins enable row level security;

create policy "Anyone can read pins"
  on public.pins for select using (true);

create policy "Anyone can insert pins"
  on public.pins for insert with check (true);
