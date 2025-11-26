import React from "react";
import styled from "styled-components";
import { Edit, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

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

const CardContainer = styled(motion.div)<{ $isComplete: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ $isComplete, theme }) => 
    $isComplete ? theme.colors.success : theme.colors.border};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  position: relative;
  overflow: hidden;

  ${({ $isComplete, theme }) =>
    $isComplete &&
    `
    background: linear-gradient(135deg, ${theme.colors.success}05 0%, ${theme.colors.success}08 100%);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ $isComplete, theme }) =>
      $isComplete ? theme.colors.success : theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const GoalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
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
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $isComplete, theme }) =>
    $isComplete ? `${theme.colors.success}22` : `${theme.colors.primary}22`};
  color: ${({ $isComplete, theme }) =>
    $isComplete ? theme.colors.success : theme.colors.primary};
  width: fit-content;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMedium};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}11;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background: ${({ theme }) => theme.colors.error}11;
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const ProgressSection = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const AmountDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
`;

const AmountGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AmountLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const AmountValue = styled.div<{ $variant: 'saved' | 'target' }>`
  font-size: ${({ $variant }) => $variant === 'saved' ? '2rem' : '1.25rem'};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $variant, theme }) => 
    $variant === 'saved' ? theme.colors.primary : theme.colors.textDark};
  line-height: 1;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const RemainingLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const AddFundsButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  margin-top: ${({ theme }) => theme.spacing.lg};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}44;
  }

  &:active {
    transform: translateY(0);
  }
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
    <CardContainer
      $isComplete={isComplete}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <TitleSection>
          <GoalTitle>{name}</GoalTitle>
          <StatusBadge $isComplete={isComplete}>
            {statusDisplayLabel}
          </StatusBadge>
        </TitleSection>
        <ActionButtons>
          <ActionButton onClick={onEdit} aria-label="Editar meta" title="Editar">
            <Edit />
          </ActionButton>
          <DeleteButton onClick={onDelete} aria-label="Excluir meta" title="Excluir">
            <Trash2 />
          </DeleteButton>
        </ActionButtons>
      </CardHeader>

      <ProgressSection>
        <AmountDisplay>
          <AmountGroup>
            <AmountLabel>Economizado</AmountLabel>
            <AmountValue $variant="saved">{formatCurrencyCompact(saved)}</AmountValue>
          </AmountGroup>
          <AmountGroup style={{ alignItems: 'flex-end' }}>
            <AmountLabel>Meta</AmountLabel>
            <AmountValue $variant="target">{formatCurrencyCompact(target)}</AmountValue>
          </AmountGroup>
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
        <AddFundsButton onClick={onAddFunds}>
          <Plus />
          <span>Adicionar Dinheiro</span>
        </AddFundsButton>
      )}
    </CardContainer>
  );
};