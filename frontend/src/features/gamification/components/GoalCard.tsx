import React from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<'COMPLETED' | 'IN_PROGRESS', string> = {
  COMPLETED: 'Concluída',
  IN_PROGRESS: 'Em Andamento',
};

interface GoalCardProps {
  id: string;
  name: string;
  target: number;
  saved: number;
  status: 'COMPLETED' | 'IN_PROGRESS';
  onAddFunds: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  name,
  target,
  saved,
  status,
  onAddFunds,
  onEdit,
  onDelete,
}) => {
  const progress = Math.min((saved / target) * 100, 100);
  const isComplete = status === "COMPLETED";
  const statusDisplayLabel = STATUS_LABELS[status];
  const remaining = Math.max(target - saved, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border-2 transition-all duration-200 relative overflow-hidden flex flex-col gap-4",
        isComplete
          ? "border-green-500 bg-gradient-to-br from-white to-green-50/50 dark:from-zinc-900 dark:to-green-900/10"
          : "border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">
            {name}
          </h3>
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide w-fit",
            isComplete
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          )}>
            {statusDisplayLabel}
          </span>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            title="Editar meta"
            className="h-9 w-9 text-zinc-500 hover:text-primary hover:bg-primary/10"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Excluir meta"
            className="h-9 w-9 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="my-2">
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Economizado</span>
            <span className="text-2xl font-bold text-primary">{formatCurrencyCompact(saved)}</span>
          </div>
          <div className="flex flex-col gap-1 items-end text-right">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Meta</span>
            <span className="text-lg font-bold text-zinc-700 dark:text-zinc-300">{formatCurrencyCompact(target)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">{progress.toFixed(0)}%</span>
          {!isComplete && remaining > 0 && (
            <span className="text-xs font-medium text-zinc-500">Faltam {formatCurrency(remaining)}</span>
          )}
        </div>

        <ProgressBar
          progress={progress}
          variant={isComplete ? "streak" : "xp"}
          height={10}
        />
      </div>

      {/* Action Button */}
      {!isComplete && (
        <Button
          variant="outline"
          className="w-full mt-auto border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          onClick={onAddFunds}
        >
          <Plus size={18} className="mr-2" />
          Adicionar Dinheiro
        </Button>
      )}
    </motion.div>
  );
};