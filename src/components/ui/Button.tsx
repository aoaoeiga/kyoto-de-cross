'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'font-sans font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gold/50';

  const variants = {
    primary: 'bg-gold text-navy hover:bg-gold-light active:bg-gold-dark',
    secondary: 'border border-gold/40 text-gold hover:bg-gold/10 active:bg-gold/20',
    ghost: 'text-gold/70 hover:text-gold hover:bg-gold/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
