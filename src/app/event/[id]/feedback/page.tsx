'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FeedbackForm from '@/components/ui/FeedbackForm';
import Header from '@/components/layout/Header';

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(feedback: {
    want_to_meet_again: boolean;
    memorable_card: string;
    recommend_score: number;
  }) {
    setSubmitting(true);
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

      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="mb-4 font-serif text-2xl text-gold">
            ありがとうございました
          </h2>
          <p className="mb-2 text-white/60">Thank you for your feedback.</p>
          <p className="mb-8 text-sm text-white/30">
            また会いましょう。/ See you again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gold/50 hover:text-gold"
          >
            ホームに戻る / Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12">
      <Header showBack backHref={`/event/${eventId}/play`} />

      <div className="mb-8 text-center">
        <h1 className="mb-2 font-serif text-xl text-gold">
          今日の体験について教えてください
        </h1>
        <p className="text-sm text-white/40">Tell us about tonight</p>
      </div>

      <FeedbackForm onSubmit={handleSubmit} isSubmitting={submitting} />
    </div>
  );
}
