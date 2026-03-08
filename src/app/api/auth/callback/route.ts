/**
 * OAuth コールバック
 * 認証コードをセッションに変換し、users テーブルにレコードがなければ作成
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(new URL('/auth/login?error=auth_failed', requestUrl.origin));
    }
  }

  // ログイン済みユーザーを取得
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
  }

  // users テーブルにレコードがあるか確認
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authUser.id)
    .single();

  if (!existingUser) {
    // OAuth 初回: users レコードを作成（名前は metadata から取得）
    const name =
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      authUser.email?.split('@')[0] ??
      'Guest';

    await supabase.from('users').insert({
      auth_id: authUser.id,
      name,
    });
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
