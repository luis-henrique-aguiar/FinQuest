import React from "react";
import styled from "styled-components";
import { Edit, Trash2, Plus } from "react-feather";
import Card from "../common/Card";
import ProgressBar from "./ProgressBar";
import Button from "../common/Button";

const STATUS_LABELS: Record<'COMPLETED' | 'IN_PROGRESS', string> = {
  COMPLETED: 'Concluída',
  IN_PROGRESS: 'Em Andamento',
};

interface GoalCardProps {
  name: string;
  target: number;
  saved: number;
  status: 'COMPLETED' | 'IN_PROGRESS';
  onAddFunds: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GoalContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme.colors.primary}18;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const GoalTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StatusBadge = styled.span<{ $isComplete: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: ${({ $isComplete, theme }) =>
    $isComplete ? theme.colors.secondary : `${theme.colors.primary}15`};
  color: ${({ $isComplete, theme }) =>
    $isComplete ? theme.colors.white : theme.colors.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

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
      color: #dc3545;
      background-color: #dc354511;
    }
  }
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const AmountDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
`;

const SavedAmount = styled.div`
  font-size: 1.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`;

const TargetLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMedium};
  text-align: right;

  span {
    display: block;
    font-size: 0.75rem;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressLabel = styled.div`
  font-size: 0.85rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const RemainingLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMedium};
`;

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
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <GoalContainer variant="elevated" padding="large">
      <CardHeader>
        <TitleSection>
          <GoalTitle>{name}</GoalTitle>
          <StatusBadge $isComplete={isComplete}>
            {isComplete ? "✓ " : "● "}
            {statusDisplayLabel}
          </StatusBadge>
        </TitleSection>
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
          <SavedAmount>{formatCurrencyCompact(saved)}</SavedAmount>
          <TargetLabel>
            <span>Meta</span>
            {formatCurrencyCompact(target)}
          </TargetLabel>
        </AmountDisplay>

        <ProgressInfo>
          <ProgressLabel>{progress.toFixed(0)}%</ProgressLabel>
          {!isComplete && remaining > 0 && (
            <RemainingLabel>Faltam {formatCurrency(remaining)}</RemainingLabel>
          )}
        </ProgressInfo>

        <ProgressBar
          progress={progress}
          variant={isComplete ? "streak" : "xp"}
          height={10}
        />
      </ProgressSection>

      {!isComplete && (
        <Button
          variant="outline"
          fullWidth
          onClick={onAddFunds}
          icon={<Plus size={18} />}
          size="medium"
        >
          Adicionar Dinheiro
        </Button>
      )}
    </GoalContainer>
  );
};
