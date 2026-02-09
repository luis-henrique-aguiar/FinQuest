import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  onClick,
  interactive = !!onClick,
  className,
  ...props
}) => {
  const baseStyles = "bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-200 border-zinc-200 dark:border-zinc-800";

  const variants = {
    default: "shadow-sm border",
    elevated: "shadow-md border",
    outlined: "border border-zinc-200 dark:border-zinc-800 shadow-none",
  };

  const paddings = {
    none: "p-0",
    small: "p-3",
    medium: "p-5",
    large: "p-8",
  };

  const interactiveStyles = interactive
    ? "cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-[0.99]"
    : "";

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], paddings[padding], interactiveStyles, className)}
      onClick={onClick}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;