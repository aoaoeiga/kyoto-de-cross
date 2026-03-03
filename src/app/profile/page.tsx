'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { PROFILE_QUESTIONS } from '@/lib/profile-questions';
import QuizInput from '@/components/ui/QuizInput';
import Header from '@/components/layout/Header';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { saveProfile } = useProfile(userId);

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (userData) {
        setUserId(userData.id);
      } else {
        router.push('/auth/register');
      }
    }
    getUser();
  }, [router]);

  const question = PROFILE_QUESTIONS[currentQuestion];

  async function handleNext() {
    if (currentQuestion < PROFILE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Save profile and redirect
      await saveProfile(answers);
      router.push('/event/create');
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  if (!question) return null;

  return (
    <>
      <Header showBack backHref="/" />
      <AnimatePresence mode="wait">
        <QuizInput
          key={question.key}
          label_ja={question.label_ja}
          label_en={question.label_en}
          type={question.type}
          options={question.options}
          value={answers[question.key] || ''}
          onChange={(value) =>
            setAnswers((prev) => ({ ...prev, [question.key]: value }))
          }
          onNext={handleNext}
          onBack={currentQuestion > 0 ? handleBack : undefined}
          placeholder_ja={question.placeholder_ja}
          placeholder_en={question.placeholder_en}
          layer={question.layer}
          currentStep={currentQuestion + 1}
          totalSteps={PROFILE_QUESTIONS.length}
        />
      </AnimatePresence>
    </>
  );
}
