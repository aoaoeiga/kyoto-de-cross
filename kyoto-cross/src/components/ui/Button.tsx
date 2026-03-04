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
  const base = 'font-sans font-medium rounded-lg transition-all duration-200 focus:outline-none';

  const variants = {
    primary: 'bg-gold text-bg hover:bg-gold-hover active:brightness-90',
    secondary: 'border border-gold/40 text-gold hover:border-gold hover:bg-gold/5 active:bg-gold/10',
    ghost: 'text-gold/60 hover:text-gold hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
