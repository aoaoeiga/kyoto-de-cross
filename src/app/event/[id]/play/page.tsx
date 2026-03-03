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
import Button from '@/components/ui/Button';
import ProgressDots from '@/components/layout/ProgressDots';

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
      // Fetch generated cards for this event
      const { data: cards } = await supabase
        .from('generated_cards')
        .select('*')
        .eq('event_id', eventId)
        .order('card_number');

      const generatedCards: GeneratedCardResponse[] = (cards || []).map(
        (c) => ({
          phase: c.phase,
          card_number: c.card_number,
          question_ja: c.question_ja,
          question_en: c.question_en,
          source_type: c.source_type,
        })
      );

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

  function handlePrev() {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1);
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
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mb-4 font-serif text-xl text-gold">
            Kyoto de Cross
          </div>
          <div className="text-sm text-white/30">Loading experience...</div>
        </motion.div>
      </div>
    );
  }

  if (!screen) return null;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Progress dots at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-navy/90 py-3 backdrop-blur-sm">
        <ProgressDots
          total={screens.length}
          current={currentScreen}
          phase={screen.phase}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col pt-12 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-1 flex-col"
          >
            {/* Narrative screens (welcome, rules, phase intros, closing) */}
            {screen.type === 'narrative' && screen.phase && screen.title?.startsWith('Phase') ? (
              <PhaseIntro
                phase={screen.phase}
                content={screen.content}
                content_en={screen.content_en}
              />
            ) : screen.type === 'narrative' ? (
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
                />
              </div>
            )}

            {/* Feedback screen */}
            {screen.type === 'feedback' && !feedbackSubmitted && (
              <div className="flex flex-1 flex-col justify-center">
                <h2 className="mb-2 text-center font-serif text-xl text-gold">
                  {screen.title}
                </h2>
                <p className="mb-8 text-center text-sm text-white/40">
                  {screen.content_en}
                </p>
                <FeedbackForm onSubmit={handleFeedbackSubmit} />
              </div>
            )}

            {screen.type === 'feedback' && feedbackSubmitted && (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-xl text-gold">
                    ありがとうございます
                  </p>
                  <p className="mt-2 text-sm text-white/40">
                    Thank you for your feedback
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-navy/90 px-6 py-4 backdrop-blur-sm">
        <button
          onClick={handlePrev}
          disabled={currentScreen === 0}
          className={`text-sm ${
            currentScreen === 0 ? 'text-white/10' : 'text-gold/50 hover:text-gold'
          }`}
        >
          ← 前へ
        </button>

        {screen.type === 'feedback' && !feedbackSubmitted ? (
          <span className="text-xs text-white/20">
            {currentScreen + 1} / {screens.length}
          </span>
        ) : currentScreen < screens.length - 1 ? (
          <Button onClick={handleNext} size="md">
            次へ / Next →
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/event/${eventId}/feedback`)}
            size="md"
          >
            終了 / Finish
          </Button>
        )}

        <span className="text-xs text-white/20">
          {currentScreen + 1} / {screens.length}
        </span>
      </div>
    </div>
  );
}
