import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { SYSTEM_PROMPT } from '@/lib/claude';

function getClients() {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  return { anthropic, supabase };
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { anthropic, supabase } = getClients();

  try {
    const { event_id } = await request.json();

    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 });
    }

    // Fetch participants and their profiles
    const { data: participants } = await supabase
      .from('event_participants')
      .select(`
        user_id,
        users (
          name,
          profiles (*)
        )
      `)
      .eq('event_id', event_id);

    const participantData = (participants || []).map((p: Record<string, unknown>) => {
      const user = p.users as Record<string, unknown> | null;
      const profiles = user?.profiles as Record<string, unknown>[] | null;
      const profile = profiles?.[0] || {};

      return {
        name: (user?.name as string) || 'Guest',
        profile: {
          one_word: profile.one_word as string | undefined,
          indoor_outdoor: profile.indoor_outdoor as string | undefined,
          morning_night: profile.morning_night as string | undefined,
          current_hobby: profile.current_hobby as string | undefined,
          favorite_food: profile.favorite_food as string | undefined,
          dream_country: profile.dream_country as string | undefined,
          biggest_worry: profile.biggest_worry as string | undefined,
          future_dream: profile.future_dream as string | undefined,
          secret: profile.secret as string | undefined,
        },
      };
    });

    const userMessage = `
Participants (${participantData.length} people):
${JSON.stringify(participantData, null, 2)}

Generate 11 conversation cards for this group. Return ONLY the JSON array, no other text.
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    // Parse the response
    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    const cards = JSON.parse(jsonMatch[0]);

    // Map turn orders
    const turnOrderMap: Record<number, string> = {
      1: 'clockwise',
      2: 'counterclockwise',
      3: 'clockwise',
      4: 'counterclockwise',
      5: 'clockwise',
      6: 'counterclockwise',
      7: 'clockwise',
      8: 'counterclockwise',
      9: 'clockwise',
      10: 'voluntary',
      11: 'voluntary',
    };

    // Save cards to database
    const cardsToInsert = cards.map(
      (card: {
        phase: number;
        card_number: number;
        question_ja: string;
        question_en: string;
        source_type: string;
      }) => ({
        event_id,
        phase: card.phase,
        card_number: card.card_number,
        question_ja: card.question_ja,
        question_en: card.question_en,
        turn_order: turnOrderMap[card.card_number] || 'voluntary',
        source_type: card.source_type,
      })
    );

    // Add the hardcoded final card
    cardsToInsert.push({
      event_id,
      phase: 3,
      card_number: 12,
      question_ja:
        '最後の質問です。職業、出身地、国籍、学歴、趣味、宗教——全部なしで、もう一度自己紹介してください。あなたは、何者ですか？',
      question_en:
        'Last question. No job, no hometown, no nationality, no education, no hobbies, no religion. Introduce yourself again. Who are you?',
      turn_order: 'voluntary',
      source_type: 'universal',
    });

    const { error: insertError } = await supabase
      .from('generated_cards')
      .insert(cardsToInsert);

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save cards' },
        { status: 500 }
      );
    }

    return NextResponse.json({ cards: cardsToInsert });
  } catch (error: unknown) {
    console.error('Generate cards error:', error);
    const err = error as Record<string, unknown>;
    return NextResponse.json(
      {
        error: 'Failed to generate cards',
        details: err?.message || String(error),
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}
