'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FeedbackForm from '@/components/ui/FeedbackForm';

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
      <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6 bg-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="mb-6 font-display text-4xl font-bold text-gold">
            Thank you.
          </h2>
          <div className="gold-line mx-auto mb-6" />
          <p className="mb-2 font-narrative text-xl text-text-main">
            また会いましょう。
          </p>
          <p className="mb-12 font-sans text-sm text-text-sub italic">
            See you again.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/')}
            className="font-sans text-sm text-gold/50 transition-colors hover:text-gold"
          >
            ホームに戻る / Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-h-dvh flex-col justify-center bg-bg py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-display text-xl font-bold text-gold">
            今日の体験について教えてください
          </h1>
          <div className="gold-line mx-auto my-4" />
          <p className="font-sans text-sm text-text-sub italic">
            Tell us about tonight
          </p>
        </div>

        <FeedbackForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </motion.div>
    </div>
  );
}
