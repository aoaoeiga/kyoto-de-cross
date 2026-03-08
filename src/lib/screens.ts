/**
 * 体験フローのスクリーン構成
 * ナラティブ・カード・フィードバックの順序を定義
 */
import { Screen, GeneratedCardResponse } from './types';

const TURN_ORDERS = {
  clockwise: '時計回りでどうぞ / Clockwise',
  counterclockwise: '反時計回りでどうぞ / Counter-clockwise',
  voluntary: '話したい人からどうぞ / Whoever wants to go first',
};

export function buildScreens(generatedCards?: GeneratedCardResponse[]): Screen[] {
  const getCard = (num: number) =>
    generatedCards?.find((c) => c.card_number === num);

  return [
    // === WELCOME ===
    {
      id: 1,
      type: 'narrative',
      title: 'Kyoto de Cross',
      content:
        'ようこそ。今日ここに集まった皆さんは、まだお互いのことを何も知りません。それが最高の状態です。これから90分間、普通の食事会とは少し違う体験が始まります。',
      content_en:
        "Welcome. None of you know anything about each other yet. That's the best starting point. Over the next 90 minutes, you're about to experience something different from an ordinary dinner.",
    },

    // === RULE ===
    {
      id: 2,
      type: 'narrative',
      title: 'ひとつだけ、ルールがあります。',
      content:
        '名前以外のラベルを、最初から明かさないでください。職業、出身地、国籍、学歴——そういう"外側の情報"はいったん置いておきましょう。\n\n今日は、あなたの内面で語ってください。考えていること。感じていること。大事にしていること。\n\nただし、自分のアイデンティティだと思うことは自由に話してOKです。それはラベルじゃなくて、あなた自身のことだから。',
      content_en:
        "Please don't reveal any labels other than your name. Job, hometown, nationality, education — set all of that aside for now.\n\nToday, speak from your inner self. What you think. What you feel. What matters to you.\n\nBut if something feels like your identity — not a label — feel free to share it.",
    },

    // === NAME ONLY ===
    {
      id: 3,
      type: 'narrative',
      title: 'では、名前だけ教えてください。',
      content: '名前と、今日の気分を一言。',
      content_en: "Your name, and how you're feeling today in one word.",
      turn_order: TURN_ORDERS.clockwise,
    },

    // === PHASE 1 INTRO ===
    {
      id: 4,
      type: 'narrative',
      phase: 1,
      title: 'Phase 1',
      content:
        'まずは気軽に。最初のカードを開きます。軽い質問から。正解はありません。楽しんでください。',
      content_en:
        "Let's start easy. Light questions first. No right answers. Just enjoy.",
    },

    // === PHASE 1 CARDS (5-9) ===
    ...([1, 2, 3, 4, 5] as const).map((num) => {
      const card = getCard(num);
      return {
        id: 4 + num,
        type: 'card' as const,
        phase: 1 as const,
        card_number: num,
        content: card?.question_ja ?? '...',
        content_en: card?.question_en ?? '...',
        turn_order: num % 2 === 1 ? TURN_ORDERS.clockwise : TURN_ORDERS.counterclockwise,
      };
    }),

    // === PHASE 2 INTRO ===
    {
      id: 10,
      type: 'narrative',
      phase: 2,
      title: 'Phase 2',
      content:
        '少し場が温まってきましたね。ここからは、自分の価値観が見えてくるような質問です。',
      content_en:
        'The room is warming up. Now, questions that reveal what you value.',
    },

    // === PHASE 2 CARDS (11-14) ===
    ...([6, 7, 8, 9] as const).map((num) => {
      const card = getCard(num);
      return {
        id: 4 + num + 1,
        type: 'card' as const,
        phase: 2 as const,
        card_number: num,
        content: card?.question_ja ?? '...',
        content_en: card?.question_en ?? '...',
        turn_order: num % 2 === 0 ? TURN_ORDERS.counterclockwise : TURN_ORDERS.clockwise,
      };
    }),

    // === PHASE 3 INTRO ===
    {
      id: 15,
      type: 'narrative',
      phase: 3,
      title: 'Phase 3',
      content:
        '最後のフェーズです。この場だけの話。正直に、でも無理せず。誰かの言葉が、誰かの心に届くかもしれません。',
      content_en:
        "The final phase. What's said here, stays here. Be honest, but no pressure. Someone's words might reach someone's heart.",
    },

    // === PHASE 3 CARDS ===
    {
      id: 16,
      type: 'card',
      phase: 3,
      card_number: 10,
      content: getCard(10)?.question_ja ?? '...',
      content_en: getCard(10)?.question_en ?? '...',
      turn_order: TURN_ORDERS.voluntary,
    },
    {
      id: 17,
      type: 'card',
      phase: 3,
      card_number: 11,
      content: getCard(11)?.question_ja ?? '...',
      content_en: getCard(11)?.question_en ?? '...',
      subtitle: 'この場の誰かが書いたことです / Someone here wrote this',
      turn_order: TURN_ORDERS.voluntary,
    },

    // === FINAL CARD ===
    {
      id: 18,
      type: 'card',
      phase: 3,
      card_number: 12,
      title: 'Final Card',
      content:
        '最後の質問です。職業、出身地、国籍、学歴、趣味、宗教——全部なしで、もう一度自己紹介してください。あなたは、何者ですか？',
      content_en:
        'Last question. No job, no hometown, no nationality, no education, no hobbies, no religion. Introduce yourself again. Who are you?',
      turn_order: TURN_ORDERS.voluntary,
    },

    // === CLOSING ===
    {
      id: 19,
      type: 'narrative',
      title: 'おつかれさまでした。',
      content:
        '90分前、皆さんは名前しか知らない他人でした。今はどうですか？\n\nもし今日出会った人にまた会いたいと思ったら、それがこの場の意味です。\n\nありがとうございました。',
      content_en:
        "90 minutes ago, you were strangers who only knew each other's names. How about now?\n\nIf you want to see someone here again, that's what this was all about.\n\nThank you.",
    },

    // === FEEDBACK ===
    {
      id: 20,
      type: 'feedback',
      title: '今日の体験について教えてください',
      content: 'feedback_form',
      content_en: 'Tell us about tonight',
    },

    // === THANK YOU ===
    {
      id: 21,
      type: 'narrative',
      title: 'Thank you.',
      content: 'また会いましょう。',
      content_en: 'See you again.',
    },
  ];
}
