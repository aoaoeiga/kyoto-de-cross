'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { PROFILE_QUESTIONS } from '@/lib/profile-questions';
import QuizInput from '@/components/ui/QuizInput';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get('edit') === 'true';

  const [userId, setUserId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { profile, loading, saveProfile, refetch } = useProfile(userId);

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

  // When profile loads in edit mode, populate answers
  useEffect(() => {
    if (profile && (editMode || isEditing)) {
      const existing: Record<string, string> = {};
      for (const q of PROFILE_QUESTIONS) {
        const val = profile[q.key as keyof typeof profile];
        if (val) existing[q.key] = String(val);
      }
      setAnswers(existing);
    }
  }, [profile, editMode, isEditing]);

  // If profile exists and not in edit mode, show profile view
  const hasProfile = !loading && profile && !editMode && !isEditing;

  if (hasProfile) {
    return (
      <div className="flex min-h-screen min-h-dvh flex-col px-6 pt-20 pb-8">
        <Header showBack backHref="/dashboard" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md"
        >
          <h1 className="mb-8 text-center font-display text-2xl font-bold text-gold">
            あなたのプロフィール
          </h1>

          <div className="space-y-4">
            {PROFILE_QUESTIONS.map((q) => {
              const val = profile[q.key as keyof typeof profile];
              if (!val) return null;

              let displayValue = String(val);
              if (q.options) {
                const opt = q.options.find((o) => o.value === val);
                if (opt) displayValue = `${opt.label_ja} / ${opt.label_en}`;
              }

              return (
                <div
                  key={q.key}
                  className="rounded-xl border border-white/5 bg-bg-card px-5 py-4"
                >
                  <p className="mb-1 font-sans text-xs text-text-sub">
                    {q.label_ja}
                  </p>
                  <p className="font-sans text-text-main">{displayValue}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full"
              size="lg"
            >
              編集する / Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="w-full"
              size="md"
            >
              戻る / Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz flow (initial setup or editing)
  const question = PROFILE_QUESTIONS[currentQuestion];
  if (!question) return null;

  async function handleNext() {
    if (currentQuestion < PROFILE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setSaving(true);
      await saveProfile(answers);
      await refetch();
      setSaving(false);
      if (editMode || isEditing) {
        setIsEditing(false);
        router.push('/profile');
      } else {
        router.push('/dashboard');
      }
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  if (saving) {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
          <p className="font-sans text-sm text-text-sub">保存中... / Saving...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-h-dvh bg-bg">
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
    </div>
  );
}
