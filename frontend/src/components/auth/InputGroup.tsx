import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  id: string;
  error?: string;
  containerClassName?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  icon,
  id,
  error,
  className,
  containerClassName,
  ...inputProps
}) => {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <Label htmlFor={id} className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {label}
      </Label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-zinc-400 pointer-events-none z-10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <Input
          id={id}
          className={cn(
            "transition-all bg-white dark:bg-zinc-900",
            icon ? "pl-10" : "",
            className
          )}
          {...inputProps}
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs font-medium">{error}</span>
      )}
    </div>
  );
};
