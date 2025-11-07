import React from "react";
import styled from "styled-components";
import { Edit, Trash2, Plus } from "react-feather";
import Card from "../common/Card";
import ProgressBar from "./ProgressBar";
import Button from "../common/Button";

interface GoalCardProps {
  name: string;
  target: number;
  saved: number;
  onAddFunds: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GoalContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  min-height: 320px;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.colors.primary}22;
  }
`;

const CompletedChip = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary} 0%, ${({ theme }) => theme.colors.secondary}DD 100%);
  color: white;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.secondary}44;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.sm};
`;

const GoalTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.3;
  flex: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  margin-left: ${({ theme }) => theme.spacing.sm};
  
  ${GoalContainer}:hover & {
    opacity: 1;
  }
  
  button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textMedium};
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
      color: ${({ theme }) => theme.colors.primary};
    }
    
    &:last-child:hover {
      color: #DC3545;
      background-color: #DC354511;
    }
  }
`;

const ProgressSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const AmountDisplay = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SavedAmount = styled.div`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1;
  word-wrap: break-word;
`;

const TargetAmount = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ProgressContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ProgressPercentage = styled.span<{ $isComplete: boolean }>`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $isComplete, theme }) => 
    $isComplete ? theme.colors.secondary : theme.colors.primary};
`;

const RemainingAmount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMedium};
  text-align: right;
  word-wrap: break-word;
`;

const ActionArea = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const AddFundsButton = styled(Button)<{ $isComplete: boolean }>`
  ${({ $isComplete }) => $isComplete && `
    background: linear-gradient(135deg, #28A745 0%, #20C997 100%);
    border-color: #28A745;
    
    &:hover {
      background: linear-gradient(135deg, #218838 0%, #1DA88A 100%);
      transform: none;
    }
  `}
`;

export const GoalCard: React.FC<GoalCardProps> = ({
  name,
  target,
  saved,
  onAddFunds,
  onEdit,
  onDelete,
}) => {
  const progress = Math.min((saved / target) * 100, 100);
  const isComplete = progress >= 100;
  const remaining = Math.max(target - saved, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatCurrencyDetailed = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <GoalContainer variant="elevated" padding="large">
      {isComplete && (
        <CompletedChip>
          ✓ Concluída
        </CompletedChip>
      )}

      <CardHeader>
        <GoalTitle>{name}</GoalTitle>
        <ActionButtons>
          <button onClick={onEdit} aria-label="Editar meta" title="Editar">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} aria-label="Excluir meta" title="Excluir">
            <Trash2 size={16} />
          </button>
        </ActionButtons>
      </CardHeader>

      <ProgressSection>
        <AmountDisplay>
          <SavedAmount>{formatCurrency(saved)}</SavedAmount>
          <TargetAmount>de {formatCurrency(target)}</TargetAmount>
        </AmountDisplay>

        <ProgressContainer>
          <ProgressLabel>
            <ProgressPercentage $isComplete={isComplete}>
              {progress.toFixed(0)}% concluído
            </ProgressPercentage>
            {!isComplete && (
              <RemainingAmount>
                Faltam {formatCurrencyDetailed(remaining)}
              </RemainingAmount>
            )}
          </ProgressLabel>
          <ProgressBar 
            progress={progress} 
            variant={isComplete ? "streak" : "xp"} 
            height={10} 
          />
        </ProgressContainer>
      </ProgressSection>

      <ActionArea>
        <AddFundsButton 
          variant={isComplete ? "primary" : "outline"} 
          fullWidth 
          onClick={onAddFunds}
          $isComplete={isComplete}
          icon={!isComplete ? <Plus size={16} /> : undefined}
        >
          {isComplete ? "🎉 Meta Alcançada!" : "Adicionar Valor"}
        </AddFundsButton>
      </ActionArea>
    </GoalContainer>
  );
};