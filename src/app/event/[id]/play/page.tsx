'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { buildScreens } from '@/lib/screens';
import { Screen, GeneratedCardResponse } from '@/lib/types';
import NarrativeScreen from '@/components/ui/NarrativeScreen';
import PhaseIntro from '@/components/ui/PhaseIntro';
import Card from '@/components/ui/Card';
import FeedbackForm from '@/components/ui/FeedbackForm';
import ProgressDots from '@/components/layout/ProgressDots';

// Card counts per phase for position tracking
const PHASE_CARD_COUNTS: Record<number, number> = { 1: 5, 2: 4, 3: 3 };
const PHASE_CARD_STARTS: Record<number, number> = { 1: 1, 2: 6, 3: 10 };

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [currentScreen, setCurrentScreen] = useState(0);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    async function loadCards() {
      const { data: cards } = await supabase
        .from('generated_cards')
        .select('phase, card_number, question_ja, question_en, source_type')
        .eq('event_id', eventId)
        .order('card_number');

      type GeneratedCardRow = {
        phase: number;
        card_number: number;
        question_ja: string;
        question_en: string;
        source_type: GeneratedCardResponse['source_type'];
      };

      const rows = (cards ?? []) as unknown as GeneratedCardRow[];
      const generatedCards: GeneratedCardResponse[] = rows.map((c) => ({
        phase: c.phase,
        card_number: c.card_number,
        question_ja: c.question_ja,
        question_en: c.question_en,
        source_type: c.source_type,
      }));

      setScreens(buildScreens(generatedCards));
      setLoading(false);
    }
    loadCards();
  }, [eventId]);

  const screen = screens[currentScreen];

  function handleNext() {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen((prev) => prev + 1);
    }
  }

  async function handleFeedbackSubmit(feedback: {
    want_to_meet_again: boolean;
    memorable_card: string;
    recommend_score: number;
  }) {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (!userData) return;

      await supabase.from('feedback').insert({
        event_id: eventId,
        user_id: userData.id,
        ...feedback,
      });

      setFeedbackSubmitted(true);
      handleNext();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center bg-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="mb-4 font-display text-2xl font-bold text-gold">
            Kyoto de Cross
          </h1>
          <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
          <p className="font-sans text-sm text-text-sub">
            Loading experience...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!screen) return null;

  // Check if current screen is the "Thank you" (last narrative)
  const isThankYou = screen.type === 'narrative' && screen.title === 'Thank you.';

  // Get card position info
  const getCardPosition = (cardNum: number, phase: number) => {
    const start = PHASE_CARD_STARTS[phase] || 1;
    return {
      positionInPhase: cardNum - start + 1,
      totalInPhase: PHASE_CARD_COUNTS[phase] || 1,
    };
  };

  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-bg">
      {/* Progress dots - minimal at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg/80 py-3 backdrop-blur-md">
        <ProgressDots
          total={screens.length}
          current={currentScreen}
        />
      </div>

      {/* Main content - full screen immersion */}
      <div className="flex flex-1 flex-col pt-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-1 flex-col"
          >
            {/* Phase Intro screens */}
            {screen.type === 'narrative' && screen.phase && screen.title?.startsWith('Phase') ? (
              <PhaseIntro
                phase={screen.phase}
                content={screen.content}
                content_en={screen.content_en}
              />
            ) : screen.type === 'narrative' && isThankYou ? (
              /* Thank You screen - special design */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="mb-6 font-display text-4xl font-bold text-gold md:text-5xl"
                >
                  Thank you.
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  <div className="gold-line mx-auto mb-6" />
                  <p className="font-narrative text-xl text-text-main">
                    {screen.content}
                  </p>
                  {screen.content_en && (
                    <p className="mt-3 font-sans text-sm text-text-sub italic">
                      {screen.content_en}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            ) : screen.type === 'narrative' ? (
              /* Regular narrative screens */
              <NarrativeScreen
                title={screen.title}
                content={screen.content}
                content_en={screen.content_en}
                turn_order={screen.turn_order}
              />
            ) : null}

            {/* Card screens */}
            {screen.type === 'card' && (
              <div className="flex flex-1 items-center justify-center px-4">
                <Card
                  question_ja={screen.content}
                  question_en={screen.content_en || ''}
                  card_number={screen.card_number || 0}
                  phase={screen.phase || 1}
                  turn_order={screen.turn_order}
                  subtitle={screen.subtitle}
                  isFinalCard={screen.card_number === 12}
                  {...(screen.phase ? getCardPosition(screen.card_number || 0, screen.phase) : {})}
                />
              </div>
            )}

            {/* Feedback screen */}
            {screen.type === 'feedback' && !feedbackSubmitted && (
              <div className="flex flex-1 flex-col justify-center px-2">
                <h2 className="mb-2 text-center font-display text-xl font-bold text-gold">
                  {screen.title}
                </h2>
                <div className="gold-line mx-auto my-3" />
                <p className="mb-8 text-center font-sans text-sm text-text-sub italic">
                  {screen.content_en}
                </p>
                <FeedbackForm onSubmit={handleFeedbackSubmit} />
              </div>
            )}

            {screen.type === 'feedback' && feedbackSubmitted && (
              <div className="flex flex-1 items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <p className="font-display text-xl font-bold text-gold">
                    ありがとうございます
                  </p>
                  <div className="gold-line mx-auto my-4" />
                  <p className="font-sans text-sm text-text-sub italic">
                    Thank you for your feedback
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation - minimal, semi-transparent */}
      {screen.type !== 'feedback' || feedbackSubmitted ? (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center bg-bg/60 px-6 py-5 backdrop-blur-md">
          {currentScreen < screens.length - 1 ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="rounded-lg border border-gold/30 bg-gold/5 px-10 py-3 font-sans text-sm text-gold transition-all duration-200 hover:border-gold/50 hover:bg-gold/10"
            >
              Next &rarr;
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/event/${eventId}/feedback`)}
              className="rounded-lg bg-gold px-10 py-3 font-sans text-sm font-medium text-bg transition-all duration-200 hover:bg-gold-hover"
            >
              終了 / Finish
            </motion.button>
          )}
        </div>
      ) : null}
    </div>
  );
}
