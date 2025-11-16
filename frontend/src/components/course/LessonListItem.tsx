import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Lock } from "react-feather";
import type { LessonProgressDTO } from "../../services/courseService";

interface LessonListItemProps {
  lesson: LessonProgressDTO;
  isLocked: boolean;
  onClick: () => void;
}

const ItemContainer = styled(motion.div)<{
  $isLocked: boolean;
  $isCompleted: boolean;
}>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: ${({ $isLocked }) => ($isLocked ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.colors.border};
  opacity: ${({ $isLocked }) => ($isLocked ? 0.6 : 1)};

  &:hover {
    ${({ $isLocked, theme }) =>
      !$isLocked &&
      `
      transform: scale(1.02);
      box-shadow: ${theme.shadows.medium};
      border-color: ${theme.colors.primary};
    `}
  }

  &:active {
    ${({ $isLocked }) => !$isLocked && "transform: scale(1.01);"}
  }
`;

const IconContainer = styled.div<{ $isCompleted: boolean; $isLocked: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $isCompleted, $isLocked, theme }) => {
    if ($isLocked) return theme.colors.backgroundAlt;
    if ($isCompleted) return `${theme.colors.success}22`;
    return `${theme.colors.primary}22`;
  }};

  svg {
    color: ${({ $isCompleted, $isLocked, theme }) => {
      if ($isLocked) return theme.colors.textLight;
      if ($isCompleted) return theme.colors.success;
      return theme.colors.primary;
    }};
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textDark};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusBadge = styled.div<{ $isCompleted: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;

  ${({ $isCompleted, theme }) =>
    $isCompleted
      ? `
        background: ${theme.colors.success}22;
        color: ${theme.colors.success};
      `
      : `
        background: ${theme.colors.backgroundAlt};
        color: ${theme.colors.textMedium};
      `}
`;

const LockedBadge = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const LessonListItem: React.FC<LessonListItemProps> = ({
  lesson,
  isLocked,
  onClick,
}) => {
  const isCompleted = lesson.isCompleted;

  const handleClick = () => {
    if (!isLocked) {
      onClick();
    }
  };

  return (
    <ItemContainer
      $isLocked={isLocked}
      $isCompleted={isCompleted}
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={!isLocked ? { scale: 1.02 } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
    >
      <IconContainer $isCompleted={isCompleted} $isLocked={isLocked}>
        {isLocked ? (
          <Lock size={20} />
        ) : isCompleted ? (
          <CheckCircle size={20} />
        ) : (
          <Circle size={20} />
        )}
      </IconContainer>

      <Content>
        <Title>{lesson.title}</Title>
      </Content>

      {isLocked ? (
        <LockedBadge>
          <Lock size={12} />
          <span>Bloqueada</span>
        </LockedBadge>
      ) : (
        <StatusBadge $isCompleted={isCompleted}>
          {isCompleted ? "✓ Concluída" : "Disponível"}
        </StatusBadge>
      )}
    </ItemContainer>
  );
};
