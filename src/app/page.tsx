'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-2 font-serif text-4xl text-gold">
          Kyoto de Cross
        </h1>
        <div className="mx-auto mb-6 h-px w-24 bg-gold/30" />
        <p className="font-serif text-lg text-white/60">
          ラベルを外して、内面で語る。
        </p>
        <p className="mt-1 text-sm text-white/30">
          Remove the labels. Speak from within.
        </p>
      </motion.div>

      {/* Decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mb-12"
      >
        <div className="h-32 w-32 rounded-full border border-gold/20 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border border-gold/15 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gold/10" />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <Link href="/auth/login">
          <Button className="w-full" size="lg">
            はじめる / Get Started
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="secondary" className="w-full" size="md">
            ログイン / Log In
          </Button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-16 text-xs text-white/20"
      >
        Cross-cultural dinner experience in Kyoto
      </motion.p>
    </div>
  );
}
