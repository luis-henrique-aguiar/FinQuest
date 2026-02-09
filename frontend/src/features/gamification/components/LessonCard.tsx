import React, { useState } from "react";
import { motion } from "framer-motion";
import { Book } from "react-feather";
import { useToast } from "@/hooks/useToast";
import { enrollInCourse, type CourseProgressDTO } from "@/features/course/services/course-api"; // Keeping this for CourseProgressDTO
import { cn } from "@/lib/utils";

interface LessonCardProps {
  course: CourseProgressDTO;
  onClick: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ course, onClick }) => {
  const { addToast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!course) return null;

  const progress = typeof course.progress === "number" ? course.progress : 0;
  const isCompleted = progress === 100;
  const isNotStarted = progress === 0;

  const isEnrolled = course.progress !== null && course.progress !== undefined;

  const getButtonText = () => {
    if (!isEnrolled) return "Iniciar Curso";
    if (isCompleted) return "Revisar Curso";
    return "Continuar";
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isEnrolled) {
      onClick();
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInCourse(course.id);
      addToast(`Matrícula realizada em ${course.title}!`, "success");
      onClick();
    } catch (error) {
      addToast("Erro ao realizar matrícula.", "error");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm cursor-pointer transition-all duration-300 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col h-full hover:shadow-lg hover:border-[#007ACC]"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-xl flex items-center justify-center shrink-0 text-2xl">
          {course.icon || "📚"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="m-0 mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {course.title || "Curso sem título"}
          </h3>
          <p className="m-0 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {course.description || "Sem descrição disponível para este curso."}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-4">
        {/* Barra de Progresso e Status (Somente se matriculado) */}
        {isEnrolled && (
          <div className="w-full">
            {isNotStarted ? (
              <div className="px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 w-fit">
                <Book size={14} />
                <span>Não Iniciado</span>
              </div>
            ) : (
              <>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-1.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#007ACC] to-[#28A745] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{progress}% concluído</span>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wide",
                    isCompleted
                      ? "bg-green-500/10 text-[#28A745]"
                      : "bg-blue-500/10 text-[#007ACC]"
                  )}>
                    {isCompleted ? "Concluído" : "Em Progresso"}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Botão de Ação Principal */}
        <button
          onClick={handleButtonClick}
          disabled={isEnrolling}
          className={cn(
            "w-full px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 border-2 flex items-center justify-center",
            isEnrolled
              ? "bg-transparent text-[#007ACC] border-[#007ACC] hover:bg-[#007ACC]/10 active:translate-y-0"
              : "bg-[#007ACC] text-white border-[#007ACC] hover:bg-[#007ACC]/90 hover:-translate-y-[1px] active:translate-y-0",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isEnrolling ? "Carregando..." : getButtonText()}
        </button>
      </div>
    </motion.div>
  );
};