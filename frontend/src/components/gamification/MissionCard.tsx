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
    coins?: number;
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
  transition: all 0.3s ease;

  ${({ completed, theme }) =>
    completed &&
    `
    border: 2px solid ${theme.colors.accent};
    background: linear-gradient(135deg, ${theme.colors.accent}11 0%, ${theme.colors.accent}22 100%);
  `}

  &:hover {
    transform: ${({ locked }) => (locked ? 'none' : 'translateY(-2px)')};
    box-shadow: ${({ locked, theme }) => 
      locked ? 'none' : `0 8px 25px ${theme.colors.primary}22`};
  }
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}22 0%, ${({ theme }) => theme.colors.accent}22 100%);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 24px;
  flex-shrink: 0;
`;

const MissionInfo = styled.div`
  flex: 1;
  min-width: 0; /* Permite que o texto seja truncado se necessário */
`;

const MissionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.3;
`;

const MissionDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.4;
`;

const ProgressContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MissionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const RewardContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.white};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textDark};
`;

const TimeEstimate = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
`;

const CompletedBadge = styled(motion.div)`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent} 0%, ${({ theme }) => theme.colors.accent}DD 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.accent}44;
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: inherit;
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

          {!completed && !locked && progress > 0 && (
            <ProgressContainer>
              <ProgressBar progress={progress} variant="xp" height={6} />
            </ProgressContainer>
          )}

          <MissionFooter>
            <RewardContainer>
              {reward.finPoints && (
                <Reward>
                  <span>💎</span>
                  <span>{reward.finPoints}</span>
                </Reward>
              )}
              {reward.coins && (
                <Reward>
                  <span>🪙</span>
                  <span>{reward.coins}</span>
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