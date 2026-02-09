import React from "react";
import { motion } from "framer-motion";
import { Award, Star, TrendingUp } from "react-feather";
import Button from "@/components/common/Button";
import type { BadgeDTO } from "@/features/course/services/lesson-api";

interface BadgeUnlockedModalProps {
  badge: BadgeDTO;
  newLevel: number;
  totalFinPoints: number;
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

const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 500, damping: 20, delay: 0.3 },
  },
} as const;

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badge,
  newLevel,
  totalFinPoints,
  onClose,
}) => {
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
          <h2 className="m-0 mb-2 text-[1.75rem] font-bold text-zinc-900 dark:text-zinc-100">
            🎉 Conquista Desbloqueada!
          </h2>
          <p className="m-0 mb-6 text-base text-zinc-500 dark:text-zinc-400">
            Você alcançou um novo marco em sua jornada financeira!
          </p>

          <motion.div
            className="bg-gradient-to-br from-[#FFA500]/10 to-[#FFA500]/20 border-2 border-[#FFA500] rounded-xl p-4 mb-6 flex items-center justify-center gap-2 text-lg font-bold text-[#FFA500]"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <TrendingUp size={24} />
            <span>Você subiu para o Nível {newLevel}!</span>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#28A745]/10 to-[#28A745]/20 border-[3px] border-[#28A745] rounded-3xl p-6 mb-6"
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-[5rem] leading-none mb-4 drop-shadow-md">
              {badge.icon}
            </div>
            <h3 className="m-0 mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {badge.title}
            </h3>
            <p className="m-0 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {badge.description}
            </p>
          </motion.div>

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
              <div className="w-10 h-10 mx-auto mb-2 bg-[#007ACC]/20 rounded-full flex items-center justify-center text-[#007ACC]">
                <Star size={20} />
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                {totalFinPoints}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-semibold">
                Total FinPoints
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
