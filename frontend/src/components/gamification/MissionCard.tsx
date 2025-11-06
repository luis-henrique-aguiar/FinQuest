import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Card from "../common/Card";
import ProgressBar from "./ProgressBar";

interface MissionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number; // 0 to 100
  reward: {
    finPoints?: number;
  };
  timeEstimate?: string; // e.g. "5 min"
  completed?: boolean;
  locked?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled(Card)<{ completed: boolean; locked: boolean }>`
  position: relative;
  overflow: hidden;
  opacity: ${({ locked }) => (locked ? 0.7 : 1)};

  ${({ completed, theme }) =>
    completed &&
    `
    border: 2px solid ${theme.colors.secondary};
  `}
`;

const MissionContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.primary}22;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 24px;
`;

const MissionInfo = styled.div`
  flex: 1;
`;

const MissionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 18px;
`;

const MissionDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const MissionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const RewardContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TimeEstimate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const CompletedBadge = styled(motion.div)`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  icon,
  progress,
  reward,
  timeEstimate,
  completed = false,
  locked = false,
  onClick,
  className,
}) => {
  return (
    <StyledCard
      variant="default"
      padding="medium"
      completed={completed}
      locked={locked}
      onClick={locked ? undefined : onClick}
      interactive={!locked && !!onClick}
      className={className}
    >
      <MissionContent>
        <IconContainer>{icon}</IconContainer>
        <MissionInfo>
          <MissionTitle>{title}</MissionTitle>
          <MissionDescription>{description}</MissionDescription>

          {!completed && !locked && (
            <ProgressBar progress={progress} variant="xp" />
          )}

          <MissionFooter>
            <RewardContainer>
              {reward.finPoints && (
                <Reward>
                  <span>💰</span>
                  <span>{reward.finPoints}</span>
                </Reward>
              )}
            </RewardContainer>
            {timeEstimate && <TimeEstimate>{timeEstimate}</TimeEstimate>}
          </MissionFooter>
        </MissionInfo>
      </MissionContent>

      {completed && (
        <CompletedBadge
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          Concluído ✓
        </CompletedBadge>
      )}

      {locked && <LockOverlay>🔒</LockOverlay>}
    </StyledCard>
  );
};

export default MissionCard;
