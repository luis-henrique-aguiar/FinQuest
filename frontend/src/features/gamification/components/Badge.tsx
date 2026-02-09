import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

type BadgeLevel = 'bronze' | 'silver' | 'gold';
type BadgeSize = 'small' | 'medium' | 'large';
type BadgeStatus = 'locked' | 'unlocked';

interface BadgeProps {
  level?: BadgeLevel;
  size?: BadgeSize;
  status?: BadgeStatus;
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  level = 'bronze',
  size = 'medium',
  status = 'unlocked',
  icon,
  label,
  onClick,
  className,
}) => {
  const sizeClasses = {
    small: "w-12 h-12 text-2xl",
    medium: "w-16 h-16 text-[32px]",
    large: "w-24 h-24 text-5xl",
  };

  const levelClasses = {
    bronze: "bg-gradient-to-br from-[#CD7F32] to-[#A46628] shadow-[0_4px_8px_rgba(205,127,50,0.3)]",
    silver: "bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] shadow-[0_4px_8px_rgba(192,192,192,0.3)]",
    gold: "bg-gradient-to-br from-[#FFD700] to-[#FFC000] shadow-[0_4px_12px_rgba(255,215,0,0.4)]",
  };

  const isLocked = status === 'locked';

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center gap-2",
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
      onClick={onClick}
      whileHover={!isLocked && onClick ? { scale: 1.05 } : {}}
      whileTap={!isLocked && onClick ? { scale: 0.95 } : {}}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full overflow-hidden",
          sizeClasses[size],
          isLocked ? "bg-[#d1d1d1] opacity-50" : levelClasses[level]
        )}
      >
        {/* Shine effect */}
        {!isLocked && (
          <div className="absolute top-0 -left-1/2 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 transform transition-all duration-300 hover:left-full" />
        )}

        {/* Icon */}
        <div className={cn(
          "flex items-center justify-center relative z-10",
          isLocked ? "text-[#888]" : "text-white"
        )}>
          {icon}
        </div>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white z-20">
            <Lock size={size === 'small' ? 14 : size === 'medium' ? 18 : 24} />
          </div>
        )}
      </div>

      {label && (
        <span className={cn(
          "text-xs font-medium text-center max-w-[100px]",
          isLocked ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"
        )}>
          {label}
        </span>
      )}
    </motion.div>
  );
};

export default Badge;