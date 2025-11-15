import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Target, Book, DollarSign, Users } from "react-feather";
import {
  MissionCategory,
  MissionStatus,
  type MissionProgressDTO,
} from "../../services/missionService";

interface MissionCardProps {
  mission: MissionProgressDTO;
}

const CardContainer = styled(motion.div)<{ status: MissionStatus }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid
    ${({ status, theme }) =>
      status === MissionStatus.COMPLETED
        ? theme.colors.success
        : "transparent"};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  ${({ status }) =>
    status === MissionStatus.COMPLETED &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(40, 167, 69, 0.1) 100%);
      pointer-events: none;
    }
  `}
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconContainer = styled.div<{ category: MissionCategory }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ category, theme }) => {
    switch (category) {
      case MissionCategory.LEARNING:
        return `linear-gradient(135deg, ${theme.colors.primary}22 0%, ${theme.colors.primary}33 100%)`;
      case MissionCategory.BUDGET:
        return `linear-gradient(135deg, ${theme.colors.secondary}22 0%, ${theme.colors.secondary}33 100%)`;
      case MissionCategory.GOALS:
        return `linear-gradient(135deg, ${theme.colors.accent}22 0%, ${theme.colors.accent}33 100%)`;
      case MissionCategory.SOCIAL:
        return `linear-gradient(135deg, ${theme.colors.info}22 0%, ${theme.colors.info}33 100%)`;
      default:
        return theme.colors.background;
    }
  }};

  svg {
    width: 28px;
    height: 28px;
    color: ${({ category, theme }) => {
      switch (category) {
        case MissionCategory.LEARNING:
          return theme.colors.primary;
        case MissionCategory.BUDGET:
          return theme.colors.secondary;
        case MissionCategory.GOALS:
          return theme.colors.accent;
        case MissionCategory.SOCIAL:
          return theme.colors.info;
        default:
          return theme.colors.textMedium;
      }
    }};
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
`;

const ProgressSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressText = styled.span`
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textMedium};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ status: MissionStatus }>`
  height: 100%;
  background: ${({ status, theme }) => {
    if (status === MissionStatus.COMPLETED) return theme.colors.success;
    if (status === MissionStatus.IN_PROGRESS) return theme.colors.primary;
    return theme.colors.textLight;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RewardBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.highlightYellow};
  border: 1px solid ${({ theme }) => theme.colors.highlightYellowBorder};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.highlightYellowBorder};
  }
`;

const StatusBadge = styled.div<{ status: MissionStatus }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ status, theme }) => {
    switch (status) {
      case MissionStatus.COMPLETED:
        return `
          background: ${theme.colors.success}22;
          color: ${theme.colors.success};
        `;
      case MissionStatus.IN_PROGRESS:
        return `
          background: ${theme.colors.primary}22;
          color: ${theme.colors.primary};
        `;
      default:
        return `
          background: ${theme.colors.backgroundAlt};
          color: ${theme.colors.textMedium};
        `;
    }
  }}
`;

const getCategoryIcon = (category: MissionCategory) => {
  switch (category) {
    case MissionCategory.LEARNING:
      return <Book />;
    case MissionCategory.BUDGET:
      return <DollarSign />;
    case MissionCategory.GOALS:
      return <Target />;
    case MissionCategory.SOCIAL:
      return <Users />;
    default:
      return <Users />;
  }
};

const getStatusText = (status: MissionStatus) => {
  switch (status) {
    case MissionStatus.COMPLETED:
      return "Concluída";
    case MissionStatus.IN_PROGRESS:
      return "Em Progresso";
    default:
      return "Disponível";
  }
};

export const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  return (
    <CardContainer
      status={mission.status}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <IconContainer category={mission.category}>
          {getCategoryIcon(mission.category)}
        </IconContainer>
        <Content>
          <Title>{mission.title}</Title>
          <Description>{mission.description}</Description>
        </Content>
      </Header>

      <ProgressSection>
        <ProgressHeader>
          <ProgressText>
            {mission.currentCount} / {mission.targetCount}
          </ProgressText>
          <ProgressText>{mission.progressPercentage}%</ProgressText>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill
            status={mission.status}
            initial={{ width: 0 }}
            animate={{ width: `${mission.progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </ProgressBar>
      </ProgressSection>

      <Footer>
        <RewardBadge>
          💎
          <span>+{mission.rewardFinPoints} FinPoints</span>
        </RewardBadge>
        <StatusBadge status={mission.status}>
          {getStatusText(mission.status)}
        </StatusBadge>
      </Footer>
    </CardContainer>
  );
};

export default MissionCard;
