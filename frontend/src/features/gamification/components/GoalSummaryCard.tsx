import React from "react";
import { motion } from "framer-motion";
import { Target } from "react-feather";
import type { GoalDTO } from "@/features/gamification/services/goals-api";
import { cn } from "@/lib/utils";

interface GoalSummaryCardProps {
  goal: GoalDTO;
  onClick: () => void;
  className?: string; // Allow external styling
}

export const GoalSummaryCard: React.FC<GoalSummaryCardProps> = ({ goal, onClick, className }) => {
  const progress = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1.01 }}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm cursor-pointer transition-all duration-300 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col h-full hover:shadow-lg hover:border-[#FFA500]",
        className
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-orange-500/20 rounded-xl flex items-center justify-center shrink-0 text-[#FFA500]">
          <Target size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="m-0 mb-1 text-[1.1rem] font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {goal.name}
          </h3>
          <p className="m-0 text-[0.85rem] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between mb-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Progresso</span>
          <strong>{progress.toFixed(0)}%</strong>
        </div>
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FFA500] to-[#FFC107] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};