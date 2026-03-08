'use client';

/** ランディングページ */
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="tarot-pattern flex min-h-screen min-h-dvh flex-col items-center justify-center px-6">
      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-16 text-center"
      >
        <h1 className="mb-4 font-display text-5xl font-bold text-gold md:text-6xl">
          Kyoto de Cross
        </h1>
        <div className="mx-auto mb-6 h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <p className="font-narrative text-xl text-text-main md:text-2xl">
          Where souls meet through dialogue
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        className="flex w-full max-w-xs flex-col gap-4"
      >
        <Link href="/auth/login">
          <Button variant="secondary" className="w-full" size="lg">
            Login
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="secondary" className="w-full" size="lg">
            Register
          </Button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-20 font-sans text-xs text-text-sub/50"
      >
        Cross-cultural dinner experience in Kyoto
      </motion.p>
    </div>
  );
}
