import React from "react";
import { TrendingUp, Landmark, PiggyBank } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type InvestmentOption } from "../../services/investimentsService";

interface InvestmentSelectProps {
  options: InvestmentOption[];
  value: string;
  onChange: (id: string) => void;
  formatRate: (rate: number) => string;
}

type CategoryType = "renda_fixa" | "tesouro" | "poupanca";

interface CategoryConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const InvestmentSelect: React.FC<InvestmentSelectProps> = ({
  options,
  value,
  onChange,
  formatRate,
}) => {
  const categoryConfig: Record<CategoryType, CategoryConfig> = {
    renda_fixa: {
      label: "Renda Fixa",
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    tesouro: {
      label: "Tesouro Direto",
      icon: <Landmark className="w-4 h-4 text-green-600" />,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    poupanca: {
      label: "Poupança",
      icon: <PiggyBank className="w-4 h-4 text-amber-500" />,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  };

  const groupedOptions = options.reduce((acc, option) => {
    const category = option.category || "renda_fixa";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, InvestmentOption[]>);

  const categoryOrder: CategoryType[] = ["renda_fixa", "tesouro", "poupanca"];

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "baixo":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "medio":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "alto":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const getLiquidityLabel = (liquidity?: string) => {
    switch (liquidity) {
      case "diaria":
        return "Liquidez Diária";
      case "mensal":
        return "Liquidez Mensal";
      case "vencimento":
        return "No Vencimento";
      default:
        return liquidity;
    }
  };

  // Custom render for the selected value trigger
  const selectedOption = options.find(o => o.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-auto py-3 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20">
        <SelectValue placeholder="Selecione um investimento">
          {selectedOption ? (
            <div className="flex flex-col items-start gap-1 text-left w-full overflow-hidden">
              <div className="flex items-center gap-2 w-full">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {selectedOption.name}
                </span>
                {selectedOption.recommended && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] px-1.5 h-5">
                    Recomendado
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="font-semibold text-primary">
                  {formatRate(selectedOption.rate)} a.a.
                </span>
                {selectedOption.risk && (
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium uppercase", getRiskColor(selectedOption.risk))}>
                    Risco {selectedOption.risk}
                  </span>
                )}
              </div>
            </div>
          ) : (
            "Selecione um investimento..."
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="max-h-[400px]">
        {categoryOrder.map((category) => {
          const categoryOptions = groupedOptions[category];
          if (!categoryOptions || categoryOptions.length === 0) return null;

          const config = categoryConfig[category];

          return (
            <SelectGroup key={category}>
              <SelectLabel className={cn("flex items-center gap-2 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50", config.color)}>
                {config.icon}
                {config.label}
              </SelectLabel>

              {categoryOptions.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  className="py-3 px-4 focus:bg-zinc-50 dark:focus:bg-zinc-800 cursor-pointer"
                >
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{option.name}</span>
                        {option.recommended && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 text-[10px] px-1.5 h-4">
                            TOP
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold text-primary text-xs whitespace-nowrap">
                        {formatRate(option.rate)} a.a.
                      </span>
                    </div>

                    {option.description && (
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {option.description}
                      </p>
                    )}

                    {(option.risk || option.liquidity) && (
                      <div className="flex items-center gap-2 mt-0.5">
                        {option.risk && (
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium uppercase", getRiskColor(option.risk))}>
                            Risco {option.risk}
                          </span>
                        )}
                        {option.liquidity && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                            {getLiquidityLabel(option.liquidity)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default InvestmentSelect;