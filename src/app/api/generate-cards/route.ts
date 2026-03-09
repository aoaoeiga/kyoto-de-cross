/**
 * 会話カード生成 API
 * イベント参加者のプロフィールを元に、Claude API で12枚のカードを生成し DB に保存
 */
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import type { CardGenerationInput, GeneratedCardResponse } from '@/lib/types';

const SYSTEM_PROMPT = `You are a conversation card designer for Kyoto de Cross, a cross-cultural dinner experience in Kyoto, Japan.

Generate 11 conversation cards (cards 1-11). Card 12 is fixed and not generated. Each card must have a Japanese question and English translation.

IMPORTANT RULES:
- Phase 1 (Cards 1-5): Universal questions. Do NOT use participant profiles. Light, fun, breaks the ice.
- Phase 2 (Cards 6-9): Deeper questions about values. You MAY use participant profiles as inspiration but don't make it obvious.
- Phase 3 (Cards 10-11): Deep, vulnerable questions. Card 11 should reference anonymous Layer 2 data if available (rephrase completely, never quote directly).

ANONYMIZATION for Layer 2: Never quote directly. Remove names, places. Rephrase in neutral language. If fewer than 3 people provided Layer 2, do not use it.

OUTPUT FORMAT: Return ONLY a valid JSON array, no other text:
[{"phase":1,"card_number":1,"question_ja":"...","question_en":"...","source_type":"universal"},...]
source_type must be "universal" | "profile_inspired" | "anonymous_layer2".`;

/** card_number から turn_order を算出（screens.ts のロジックに合わせる） */
function getTurnOrder(cardNumber: number): 'clockwise' | 'counterclockwise' | 'voluntary' {
  if (cardNumber >= 10) return 'voluntary';
  if (cardNumber <= 5) {
    return cardNumber % 2 === 1 ? 'clockwise' : 'counterclockwise';
  }
  return cardNumber % 2 === 0 ? 'counterclockwise' : 'clockwise';
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const eventId = body?.event_id as string | undefined;
    if (!eventId) {
      return NextResponse.json(
        { error: 'event_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // イベントと参加者（ユーザー・プロフィール）を取得
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, host_id')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // event_participants -> users (user_id) -> profiles (user_id)
    const { data: participants } = await supabase
      .from('event_participants')
      .select(`
        user:users(id, name, profiles(one_word, indoor_outdoor, morning_night, current_hobby, favorite_food, dream_country, biggest_worry, future_dream, secret))
      `)
      .eq('event_id', eventId);

    if (!participants || participants.length === 0) {
      return NextResponse.json(
        { error: 'No participants in this event' },
        { status: 400 }
      );
    }

    // CardGenerationInput 形式に変換
    type ParticipantRow = {
      user: { id: string; name: string; profiles?: Array<Record<string, unknown>> } | null;
    };

    const participantList = (participants ?? []) as unknown as ParticipantRow[];

    const input: CardGenerationInput = {
      participants: participantList
        .filter((p) => p.user)
        .map((p) => ({
          name: p.user!.name,
          profile: (p.user!.profiles?.[0] as CardGenerationInput['participants'][0]['profile']) ?? {},
        })),
      participant_count: participantList.length,
    };

    const userMessage = `Generate cards for these participants:
${JSON.stringify(input, null, 2)}`;

    const anthropic = new Anthropic({ apiKey });
    let response;
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      });
    } catch (anthropicError: unknown) {
      const msg = anthropicError instanceof Error ? anthropicError.message : String(anthropicError);
      const isAuthError =
        msg.includes('invalid x-api-key') ||
        msg.includes('authentication_error') ||
        (anthropicError as { status?: number })?.status === 401;
      if (isAuthError) {
        return NextResponse.json(
          {
            error:
              'Anthropic API キーが無効です。Vercel の環境変数 ANTHROPIC_API_KEY を確認してください。 / Invalid or missing ANTHROPIC_API_KEY.',
          },
          { status: 401 }
        );
      }
      throw anthropicError;
    }

    const textBlock = response.content.find((c) => c.type === 'text');
    const text = textBlock?.type === 'text' ? textBlock.text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const cards: GeneratedCardResponse[] = JSON.parse(jsonStr);

    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Failed to parse cards from Claude response' },
        { status: 500 }
      );
    }

    // DB に保存
    const toInsert = cards.map((c) => ({
      event_id: eventId,
      phase: c.phase,
      card_number: c.card_number,
      question_ja: c.question_ja,
      question_en: c.question_en,
      turn_order: getTurnOrder(c.card_number),
      source_type: c.source_type,
    }));

    const { error: insertError } = await supabase
      .from('generated_cards')
      .insert(toInsert);

    if (insertError) {
      console.error('Insert cards error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save cards' },
        { status: 500 }
      );
    }

    return NextResponse.json({ cards, saved: true });
  } catch (e) {
    console.error('generate-cards error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
