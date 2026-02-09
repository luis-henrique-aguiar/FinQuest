import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  variant?: "default" | "streak" | "xp";
  height?: number;
  tooltipText?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = "default",
  height = 8,
  tooltipText,
  className,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getVariantClasses = () => {
    switch (variant) {
      case "streak":
        return "bg-gradient-to-r from-orange-500 to-amber-500";
      case "xp":
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className={cn(
        "relative w-full bg-zinc-100 dark:bg-zinc-800 rounded-full group",
        className
      )}
      style={{ height }}
    >
      <motion.div
        className={cn(
          "h-full rounded-full",
          getVariantClasses()
        )}
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {tooltipText && (
        <div className="absolute bottom-[150%] left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltipText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
