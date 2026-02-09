import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { LessonProgressDTO } from "@/features/course/services/course-api";

interface LessonListItemProps {
  lesson: LessonProgressDTO;
  isLocked: boolean;
  onClick: () => void;
}

export const LessonListItem: React.FC<LessonListItemProps> = ({
  lesson,
  isLocked,
  onClick,
}) => {
  const isCompleted = lesson.isCompleted;

  const handleClick = () => {
    if (!isLocked) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={!isLocked ? { scale: 1.02 } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
      onClick={handleClick}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-lg p-4 flex items-center gap-4 border-2 transition-all duration-300",
        isLocked
          ? "border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
          : "border-zinc-200 dark:border-zinc-800 cursor-pointer hover:shadow-md hover:border-primary",
        isCompleted && "border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
        isLocked
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          : isCompleted
            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            : "bg-primary/10 text-primary"
      )}>
        {isLocked ? (
          <Lock size={20} />
        ) : isCompleted ? (
          <CheckCircle size={20} />
        ) : (
          <Circle size={20} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="m-0 text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {lesson.title}
        </h4>
      </div>

      {isLocked ? (
        <Badge variant="secondary" className="flex items-center gap-1 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <Lock size={12} />
          <span className="text-xs uppercase tracking-wide font-semibold">Bloqueada</span>
        </Badge>
      ) : (
        <Badge
          variant={isCompleted ? "default" : "secondary"}
          className={cn(
            "text-xs uppercase tracking-wide font-semibold",
            isCompleted
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400"
          )}
        >
          {isCompleted ? "✓ Concluída" : "Disponível"}
        </Badge>
      )}
    </motion.div>
  );
};
