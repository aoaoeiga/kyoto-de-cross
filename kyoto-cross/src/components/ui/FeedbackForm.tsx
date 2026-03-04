'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

type FeedbackFormProps = {
  onSubmit: (feedback: {
    want_to_meet_again: boolean;
    memorable_card: string;
    recommend_score: number;
  }) => void;
  isSubmitting?: boolean;
};

export default function FeedbackForm({ onSubmit, isSubmitting }: FeedbackFormProps) {
  const [wantToMeetAgain, setWantToMeetAgain] = useState<boolean | null>(null);
  const [memorableCard, setMemorableCard] = useState('');
  const [recommendScore, setRecommendScore] = useState<number | null>(null);

  const canSubmit = wantToMeetAgain !== null && recommendScore !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-sm space-y-10 px-6"
    >
      {/* Question 1: Want to meet again? */}
      <div>
        <p className="mb-2 font-jp text-lg text-text-main">
          今日出会った人に、また会いたいですか？
        </p>
        <div className="gold-line mb-3" />
        <p className="mb-5 font-sans text-sm text-text-sub italic">
          Do you want to meet the people you met today again?
        </p>
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setWantToMeetAgain(true)}
            className={`flex-1 rounded-xl border-2 py-4 font-sans text-base font-medium transition-all duration-200 ${
              wantToMeetAgain === true
                ? 'border-gold bg-gold text-bg'
                : 'border-white/10 bg-bg-card text-text-main hover:border-gold/30'
            }`}
          >
            はい / Yes
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setWantToMeetAgain(false)}
            className={`flex-1 rounded-xl border-2 py-4 font-sans text-base font-medium transition-all duration-200 ${
              wantToMeetAgain === false
                ? 'border-white/30 bg-white/10 text-text-main'
                : 'border-white/10 bg-bg-card text-text-main hover:border-white/20'
            }`}
          >
            いいえ / No
          </motion.button>
        </div>
      </div>

      {/* Question 2: Memorable card */}
      <div>
        <p className="mb-2 font-jp text-lg text-text-main">
          一番印象に残ったカードは？
        </p>
        <div className="gold-line mb-3" />
        <p className="mb-5 font-sans text-sm text-text-sub italic">
          Which card was most memorable?
        </p>
        <textarea
          value={memorableCard}
          onChange={(e) => setMemorableCard(e.target.value)}
          placeholder="自由に書いてください / Free text"
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
        />
      </div>

      {/* Question 3: Recommend score */}
      <div>
        <p className="mb-2 font-jp text-lg text-text-main">
          友達にこの体験を勧めたいですか？
        </p>
        <div className="gold-line mb-3" />
        <p className="mb-5 font-sans text-sm text-text-sub italic">
          Would you recommend this experience to a friend?
        </p>
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((score) => (
            <motion.button
              key={score}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRecommendScore(score)}
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-sans text-lg font-medium transition-all duration-200 ${
                recommendScore !== null && score <= recommendScore
                  ? 'border-gold bg-gold/20 text-gold'
                  : 'border-white/10 text-text-sub hover:border-gold/30'
              }`}
            >
              {score}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={() => {
          if (canSubmit) {
            onSubmit({
              want_to_meet_again: wantToMeetAgain!,
              memorable_card: memorableCard,
              recommend_score: recommendScore!,
            });
          }
        }}
        disabled={!canSubmit || isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? '送信中...' : '送信する / Submit'}
      </Button>
    </motion.div>
  );
}
