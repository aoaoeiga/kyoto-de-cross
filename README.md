# Kyoto de Cross

クロスカルチャーな対話体験アプリ。京都でのディナーイベントで、内面からつながる90分の会話をデザインします。

## 技術スタック

- Next.js 14 (App Router)
- Supabase (Auth, Database)
- Anthropic Claude API
- Tailwind CSS / Framer Motion

## セットアップ

### 1. 依存関係

```bash
npm install
```

### 2. 環境変数

`.env.local.example` をコピーして `.env.local` を作成し、値を設定:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

### 3. データベース

`supabase/migration.sql` を Supabase SQL エディタで実行。既存 DB には `migration_add_one_word.sql` で `one_word` カラムを追加。

### 4. 開発サーバー

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で開く。

## ディレクトリ構成

```
src/
├── app/          # ページ・API
├── components/   # UI コンポーネント
├── hooks/        # React フック
└── lib/          # 型・Supabase・設定
```
