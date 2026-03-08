-- 既存の DB に one_word カラムを追加する場合のマイグレーション
-- 初回セットアップの migration.sql に one_word が含まれている場合は不要
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS one_word TEXT;
