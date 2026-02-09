import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "./ProgressBar";
import { enrollInCourse } from '@/features/course/services/course-api';
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number | null;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  icon,
  progress,
}) => {
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = progress !== null;
  const isCompleted = progress === 100;

  const handleCardClick = () => {
    if (isEnrolled) {
      navigate(`/learn/${id}`);
    }
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }

    setIsEnrolling(true);

    try {
      await enrollInCourse(id);
      toast.success(`Matrícula em "${title}" realizada!`);
      navigate(`/learn/${id}`);
    } catch (error) {
      toast.error("Ops! Não foi possível realizar a matrícula. Tente novamente.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const getButtonText = () => {
    if (isCompleted) return "Revisar Curso";
    if (isEnrolled) return "Continuar Curso";
    return "Iniciar Curso";
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-xl border shadow-sm transition-all duration-300 flex flex-col h-full relative overflow-hidden group",
        isEnrolled
          ? "border-primary/20 cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
          : "border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:-translate-y-1"
      )}
    >
      <div className="p-6 flex flex-col gap-4 flex-grow">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-4xl shrink-0 group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {title}
            </h3>
            {isEnrolled && (
              <div className="flex items-center gap-2 mt-1">
                {isCompleted ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Concluído
                  </Badge>
                ) : (
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Progresso: <span className="text-primary font-bold">{progress}%</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-grow">
          {description}
        </p>

        {isEnrolled && (
          <div className="mt-auto pt-2">
            <ProgressBar
              progress={progress || 0}
              variant="xp"
              height={8}
              tooltipText={`${progress}% concluído`}
            />
          </div>
        )}
      </div>

      <div className="p-4 pt-0 mt-auto">
        <Button
          variant={isEnrolled ? "outline" : "default"}
          className={cn(
            "w-full transition-all",
            isEnrolled
              ? "border-primary text-primary hover:bg-primary hover:text-white"
              : "bg-primary text-white hover:bg-primary/90"
          )}
          onClick={handleButtonClick}
          disabled={isEnrolling}
        >
          {isEnrolling ? "Carregando..." : getButtonText()}
        </Button>
      </div>
    </div>
  );
};
