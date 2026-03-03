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

  const canSubmit =
    wantToMeetAgain !== null && recommendScore !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-sm space-y-8 px-6"
    >
      {/* Question 1 */}
      <div>
        <p className="mb-2 font-serif text-lg text-white/90">
          今日出会った人に、また会いたいですか？
        </p>
        <p className="mb-4 text-sm text-white/40">
          Do you want to meet the people you met today again?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setWantToMeetAgain(true)}
            className={`flex-1 rounded-lg border px-4 py-3 transition-all ${
              wantToMeetAgain === true
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/10 text-white/60 hover:border-gold/30'
            }`}
          >
            はい / Yes
          </button>
          <button
            onClick={() => setWantToMeetAgain(false)}
            className={`flex-1 rounded-lg border px-4 py-3 transition-all ${
              wantToMeetAgain === false
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/10 text-white/60 hover:border-gold/30'
            }`}
          >
            いいえ / No
          </button>
        </div>
      </div>

      {/* Question 2 */}
      <div>
        <p className="mb-2 font-serif text-lg text-white/90">
          一番印象に残ったカードは？
        </p>
        <p className="mb-4 text-sm text-white/40">
          Which card was most memorable?
        </p>
        <input
          type="text"
          value={memorableCard}
          onChange={(e) => setMemorableCard(e.target.value)}
          placeholder="自由に書いてください / Free text"
          className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white/90 placeholder:text-white/20 focus:border-gold/50 focus:outline-none"
        />
      </div>

      {/* Question 3 */}
      <div>
        <p className="mb-2 font-serif text-lg text-white/90">
          友達にこの体験を勧めたいですか？
        </p>
        <p className="mb-4 text-sm text-white/40">
          Would you recommend this experience to a friend?
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => setRecommendScore(score)}
              className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-all ${
                recommendScore === score
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/10 text-white/60 hover:border-gold/30'
              }`}
            >
              {score}
            </button>
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
