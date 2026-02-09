import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Award } from 'react-feather';
import Button from '@/components/common/Button';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 50 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
  exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } },
} as const;

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 500, damping: 20, delay: 0.2 },
  },
} as const;

const levelBadgeVariants = {
  hidden: { scale: 0, y: 20 },
  visible: {
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20, delay: 0.3 },
  },
} as const;

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-black/80 flex items-center justify-center z-[3000] p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl relative"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FFA500]/10 to-[#FFA500]/20 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(255,165,0,0.25)]"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <TrendingUp className="text-[#FFA500]" size={40} />
          </motion.div>

          <h2 className="m-0 mb-2 text-[1.75rem] font-bold text-zinc-900 dark:text-zinc-100">
            🎉 Parabéns!
          </h2>

          <motion.div
            className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-[#FFA500]/10 to-[#FFA500]/20 border-2 border-[#FFA500] rounded-full my-6 text-2xl font-bold text-[#FFA500]"
            variants={levelBadgeVariants}
            initial="hidden"
            animate="visible"
          >
            <Star size={24} />
            <span>Nível {newLevel}</span>
          </motion.div>

          <p className="m-0 mb-6 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Você alcançou um novo patamar em sua jornada de educação financeira!
            Continue aprendendo para desbloquear mais conquistas.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F8F9FA] dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-[#FFA500]/20 rounded-full flex items-center justify-center text-[#FFA500]">
                <Award size={20} />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                {newLevel}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-semibold">
                Nível Atual
              </div>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-[#28A745]/20 rounded-full flex items-center justify-center text-[#28A745]">
                <TrendingUp size={20} />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                +1
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-semibold">
                Nível Ganho
              </div>
            </div>
          </div>

          <Button variant="primary" onClick={onClose} fullWidth>
            Continuar Jornada
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};