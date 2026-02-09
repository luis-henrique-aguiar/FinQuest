import React, { useState } from "react";
import { Edit2, Check, X, User, Mail } from "react-feather";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: "text" | "email";
  disabled?: boolean;
  placeholder?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  type = "text",
  disabled = false,
  placeholder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    // Basic email validation
    if (type === "email" && editValue.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editValue.trim())) {
        addToast("Por favor, insira um email válido", "error");
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
      // Success toast should be handled by the parent
    } catch (error) {
      console.error("Erro ao salvar:", error);
      // Error toast should be handled by the parent
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "email":
        return <Mail size={16} />;
      default:
        return <User size={16} />;
    }
  };

  return (
    <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span className="font-medium text-zinc-900 dark:text-zinc-100 min-w-[100px]">{label}</span>

      {isEditing ? (
        <>
          <div className="flex-1 mx-4 relative flex items-center">
            <div className="absolute left-3 text-zinc-400 pointer-events-none z-10">
              {getIcon()}
            </div>
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              autoFocus
              disabled={isLoading}
              className="pl-10 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus-visible:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              disabled={isLoading}
              title="Salvar"
              className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
              title="Cancelar"
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X size={18} />
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className="text-zinc-500 dark:text-zinc-400 flex-1 mx-4">{value || placeholder}</span>
          {disabled ? (
            <span className="text-zinc-400 text-sm italic">Não editável</span>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              title="Editar"
              className="h-8 w-8 text-zinc-400 hover:text-primary hover:bg-primary/5"
            >
              <Edit2 size={16} />
            </Button>
          )}
        </>
      )}
    </div>
  );
};