import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export const SectionTitle = ({ children, className }: SectionTitleProps) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "m-0 text-2xl font-bold text-[#007ACC] border-b-2 border-[#007ACC]/20 pb-2 mb-4 dark:text-[#007ACC]",
        className
      )}
    >
      {children}
    </motion.h2>
  );
};

export default SectionTitle;