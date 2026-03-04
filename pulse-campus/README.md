# VITA - キャンパス気分マップ

大学キャンパスで学生が「今の気分」をワンタップで投稿し、地図上にリアルタイムで可視化するWebアプリです。
オフラインでの偶発的な出会いと対話を促進することを目的としています。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + React 19 + TypeScript
- **スタイリング**: Tailwind CSS
- **地図表示**: Leaflet + OpenStreetMap (react-leaflet)
- **バックエンド**: Supabase (PostgreSQL + Realtime + Auth)
- **デプロイ**: Vercel

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd pulse-campus
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabaseのセットアップ

`supabase/migrations/001_create_pins.sql` のSQLをSupabaseのSQL Editorで実行してください。

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## ディレクトリ構成

```
src/
├── app/                    … Next.js App Router
│   ├── layout.tsx          … ルートレイアウト
│   ├── page.tsx            … メインマップページ
│   ├── globals.css         … グローバルスタイル
│   └── api/moods/route.ts  … 気分投稿API (GET/POST)
├── components/
│   ├── map/                … 地図関連コンポーネント
│   ├── mood/               … 気分選択UI
│   ├── feed/               … リアルタイムフィード
│   └── stats/              … 統計表示
├── lib/
│   ├── supabase.ts         … Supabaseクライアント
│   ├── constants.ts        … 定数定義
│   └── hooks/              … カスタムフック
├── types/                  … TypeScript型定義
└── utils/                  … ユーティリティ関数
```

## 気分の種類

| ID | 絵文字 | ラベル | カラー |
|----|--------|--------|--------|
| talk | 💬 | 話したい | #FF6B6B |
| chill | ☕ | まったり | #4ECDC4 |
| study | 📚 | 集中中 | #45B7D1 |
| down | 🌧 | 落ち込み | #A78BFA |
| hype | 🔥 | テンション高 | #F59E0B |
| bored | 💤 | 暇すぎ | #EC4899 |

## 今後の開発予定

- [ ] Leaflet地図のインタラクティブ表示
- [ ] Supabase Realtimeによるリアルタイム更新
- [ ] ユーザー認証（Supabase Auth）
- [ ] ピンの自動削除（2時間経過後）
- [ ] キャンパススポットの正確な座標設定
- [ ] モバイルレスポンシブ対応の改善
- [ ] PWA対応
- [ ] プッシュ通知
