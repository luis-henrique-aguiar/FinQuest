import React, { useState } from "react";
import styled from "styled-components";
import { Edit2, Check, X, User, Mail } from "react-feather";
import { useToast } from "../../hooks/useToast";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: "text" | "email";
  disabled?: boolean;
  placeholder?: string;
}

const FieldContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  
  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textDark};
  min-width: 100px;
`;

const FieldValue = styled.span`
  color: ${({ theme }) => theme.colors.textMedium};
  flex: 1;
  margin: 0 ${({ theme }) => theme.spacing.md};
`;

const EditInputContainer = styled.div`
  flex: 1;
  margin: 0 ${({ theme }) => theme.spacing.md};
  position: relative;
  display: flex;
  align-items: center;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 0.9rem;
  font-family: "Nunito Sans", sans-serif;
  transition: all 0.3s ease;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #6c757d;
  pointer-events: none;
  z-index: 1;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.textMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DisabledText = styled.span`
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 0.8rem;
  font-style: italic;
`;

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

    // Validação básica para email
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
      //addToast("Informação atualizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      //addToast("Erro ao atualizar informação", "error");
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
    <FieldContainer>
      <FieldLabel>{label}</FieldLabel>
      
      {isEditing ? (
        <>
          <EditInputContainer>
            <InputIcon>{getIcon()}</InputIcon>
            <EditInput
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              autoFocus
              disabled={isLoading}
            />
          </EditInputContainer>
          <ActionsContainer>
            <ActionButton
              onClick={handleSave}
              disabled={isLoading}
              title="Salvar"
            >
              <Check size={16} />
            </ActionButton>
            <ActionButton
              onClick={handleCancel}
              disabled={isLoading}
              title="Cancelar"
            >
              <X size={16} />
            </ActionButton>
          </ActionsContainer>
        </>
      ) : (
        <>
          <FieldValue>{value || placeholder}</FieldValue>
          {disabled ? (
            <DisabledText>Não editável</DisabledText>
          ) : (
            <ActionButton onClick={handleEdit} title="Editar">
              <Edit2 size={16} />
            </ActionButton>
          )}
        </>
      )}
    </FieldContainer>
  );
};