import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Target } from "react-feather";
import { type GoalDTO } from "../../services/goalService";

interface GoalSummaryCardProps {
  goal: GoalDTO;
  onClick: () => void;
}

const CardContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: scale(1.03);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:active {
    transform: scale(1.01);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent}22 0%,
    ${({ theme }) => theme.colors.accent}33 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.accent};
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ValuesText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
`;

const ProgressSection = styled.div`
  margin-top: auto;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.warning} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  width: ${({ $progress }) => $progress}%;
`;

export const GoalSummaryCard: React.FC<GoalSummaryCardProps> = ({ goal, onClick }) => {
  const progress = goal.targetAmount > 0 
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
    : 0;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    });
  };

  return (
    <CardContainer
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <IconContainer>
          <Target size={24} />
        </IconContainer>
        <Content>
          <Title>{goal.name}</Title>
          <ValuesText>
            {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
          </ValuesText>
        </Content>
      </Header>

      <ProgressSection>
        <ProgressHeader>
          <span>Progresso</span>
          <strong>{progress.toFixed(0)}%</strong>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill
            $progress={progress}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </ProgressBar>
      </ProgressSection>
    </CardContainer>
  );
};