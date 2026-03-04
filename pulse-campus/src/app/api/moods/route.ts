import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MoodType } from "@/types";

// 有効な気分タイプ
const VALID_MOODS: MoodType[] = ["talk", "chill", "study", "down", "hype", "bored"];

// GET: ピンデータの取得（直近2時間分）
export async function GET() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("pins")
    .select("*")
    .gte("created_at", twoHoursAgo)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/moods] Supabase select error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST: 新しいピンの投稿（同一ユーザーの既存ピンは上書き）
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { mood, spot_id, latitude, longitude, user_id, anonymous_id } = body;

  // バリデーション
  if (!mood || !VALID_MOODS.includes(mood)) {
    return NextResponse.json(
      { error: "無効な気分タイプです" },
      { status: 400 }
    );
  }

  if (!spot_id || typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json(
      { error: "必須パラメータが不足しています" },
      { status: 400 }
    );
  }

  // 同一ユーザーの既存ピンを削除（一人一投稿）- エラーは無視して続行
  if (user_id) {
    const { error: delErr } = await supabase
      .from("pins")
      .delete()
      .eq("user_id", user_id);
    if (delErr) {
      console.error("[POST /api/moods] delete by user_id error (ignored):", delErr);
    }
  } else if (anonymous_id) {
    const { error: delErr } = await supabase
      .from("pins")
      .delete()
      .eq("anonymous_id", anonymous_id);
    if (delErr) {
      console.error("[POST /api/moods] delete by anonymous_id error (ignored):", delErr);
    }
  }

  // 新しいピンを挿入
  const insertData: Record<string, unknown> = {
    mood,
    spot_id,
    latitude,
    longitude,
  };

  if (user_id) {
    insertData.user_id = user_id;
  }
  if (anonymous_id) {
    insertData.anonymous_id = anonymous_id;
  }

  const { data, error } = await supabase
    .from("pins")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("[POST /api/moods] Supabase insert error:", error);
    // anonymous_id カラムが存在しない場合のフォールバック
    if (error.message.includes("anonymous_id") && anonymous_id) {
      console.error("[POST /api/moods] Retrying without anonymous_id...");
      delete insertData.anonymous_id;
      const { data: retryData, error: retryErr } = await supabase
        .from("pins")
        .insert(insertData)
        .select()
        .single();
      if (retryErr) {
        console.error("[POST /api/moods] Retry insert error:", retryErr);
        return NextResponse.json({ error: retryErr.message }, { status: 500 });
      }
      return NextResponse.json(retryData, { status: 201 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH: 自分のピンの位置情報を更新（現在地が50m以上移動した場合）
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { pin_id, latitude, longitude, user_id, anonymous_id } = body;

  // バリデーション
  if (!pin_id || typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json(
      { error: "pin_id, latitude, longitude は必須です" },
      { status: 400 }
    );
  }

  if (!user_id && !anonymous_id) {
    return NextResponse.json(
      { error: "user_id または anonymous_id が必要です" },
      { status: 400 }
    );
  }

  // 自分のピンのみ更新可能にするためフィルタ条件を構築
  let query = supabase
    .from("pins")
    .update({ latitude, longitude })
    .eq("id", pin_id);

  if (user_id) {
    query = query.eq("user_id", user_id);
  } else {
    query = query.eq("anonymous_id", anonymous_id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error("[PATCH /api/moods] Supabase update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
