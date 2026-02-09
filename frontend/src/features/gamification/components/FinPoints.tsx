import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FinPointsProps {
  points: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

export const FinPoints: React.FC<FinPointsProps> = ({
  points,
  size = 'medium',
  showLabel = true,
  className,
}) => {

  const formattedPoints = points.toLocaleString('pt-BR');

  const sizeResult = {
    small: { gap: 'gap-1', icon: 'text-base', text: 'text-[14px]', label: 'text-[10px]' },
    medium: { gap: 'gap-2', icon: 'text-2xl', text: 'text-[18px]', label: 'text-xs' },
    large: { gap: 'gap-4', icon: 'text-[32px]', text: 'text-2xl', label: 'text-sm' },
  };

  const currentSize = sizeResult[size];

  return (
    <motion.div
      className={cn("flex items-center", currentSize.gap, className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn("flex items-center justify-center text-[#007ACC]", currentSize.icon)}>
        💎
      </div>
      <div>
        <span className={cn("font-heading font-bold text-zinc-900 dark:text-zinc-100 block leading-none", currentSize.text)}>
          {formattedPoints}
        </span>
        {showLabel && (
          <span className={cn("text-zinc-500 dark:text-zinc-400 block leading-none mt-0.5", currentSize.label)}>
            FinPoints
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default FinPoints;