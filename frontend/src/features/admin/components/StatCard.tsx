import React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-transparent",
        className
      )}
      style={{ borderLeftColor: color }}
    >
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-colors"
        style={{
          backgroundColor: `${color}15`,
          color: color
        }}
      >
        <Icon size={32} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2 truncate">
          {title}
        </div>
        <div className="text-[32px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
};