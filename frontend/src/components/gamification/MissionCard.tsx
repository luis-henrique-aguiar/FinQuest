import React from "react";
import { motion } from "framer-motion";
import { Target, Book, DollarSign, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MissionCategory,
  MissionStatus,
  type MissionProgressDTO,
} from "../../services/missionService";

interface MissionCardProps {
  mission: MissionProgressDTO;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  const isCompleted = mission.status === MissionStatus.COMPLETED;
  const isInProgress = mission.status === MissionStatus.IN_PROGRESS;

  const getCategoryIcon = (category: MissionCategory) => {
    switch (category) {
      case MissionCategory.LEARNING:
        return <Book className="w-7 h-7" />;
      case MissionCategory.BUDGET:
        return <DollarSign className="w-7 h-7" />;
      case MissionCategory.GOALS:
        return <Target className="w-7 h-7" />;
      case MissionCategory.SOCIAL:
        return <Users className="w-7 h-7" />;
      default:
        return <Book className="w-7 h-7" />;
    }
  };

  const getStatusText = (status: MissionStatus) => {
    switch (status) {
      case MissionStatus.COMPLETED:
        return "Concluída";
      case MissionStatus.IN_PROGRESS:
        return "Em Progresso";
      default:
        return "Disponível";
    }
  };

  const getIconColors = () => {
    if (isCompleted) {
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    }

    switch (mission.category) {
      case MissionCategory.LEARNING:
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case MissionCategory.BUDGET:
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case MissionCategory.GOALS:
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case MissionCategory.SOCIAL:
        return "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400";
      default:
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const getProgressGradient = () => {
    if (isCompleted) {
      return "bg-gradient-to-r from-green-500 to-emerald-400";
    }
    if (isInProgress) {
      return "bg-gradient-to-r from-blue-500 to-indigo-500";
    }
    return "bg-zinc-300 dark:bg-zinc-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-all duration-300 flex flex-col gap-4 border-2 group hover:-translate-y-1 hover:shadow-md cursor-pointer bg-white dark:bg-zinc-900",
        isCompleted
          ? "border-green-500 bg-gradient-to-br from-white to-green-50/50 dark:from-zinc-900 dark:to-green-900/10"
          : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
      )}
    >
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 z-10"
        >
          <Check size={18} strokeWidth={3} />
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors", getIconColors())}>
          {getCategoryIcon(mission.category)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1 line-clamp-1">
            {mission.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {mission.description}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-zinc-500 dark:text-zinc-400">
            {mission.currentCount} / {mission.targetCount}
          </span>
          <span className="font-bold text-primary">
            {mission.progressPercentage}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", getProgressGradient())}
            initial={{ width: 0 }}
            animate={{ width: `${mission.progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-full">
          <span className="text-base">💎</span>
          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">
            +{mission.rewardFinPoints} FinPoints
          </span>
        </div>

        <span className={cn(
          "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
          isCompleted
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : isInProgress
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        )}>
          {getStatusText(mission.status)}
        </span>
      </div>
    </motion.div>
  );
};
