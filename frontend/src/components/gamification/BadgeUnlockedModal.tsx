import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Award, Star, TrendingUp } from "react-feather";
import Button from "../common/Button";
import type { BadgeDTO } from "../../services/lessonService";

interface BadgeUnlockedModalProps {
  badge: BadgeDTO;
  newLevel: number;
  totalFinPoints: number;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  position: relative;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const Subtitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const BadgeContainer = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success}11 0%,
    ${({ theme }) => theme.colors.success}22 100%
  );
  border: 3px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BadgeIcon = styled.div`
  font-size: 5rem;
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
`;

const BadgeTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const BadgeDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
  background: ${({ color }) => `${color}22`};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ color }) => color};
    width: 20px;
    height: 20px;
  }
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const LevelUpBanner = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent}22 0%,
    ${({ theme }) => theme.colors.accent}33 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 50 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
  exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } },
} as const;

const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 500, damping: 20, delay: 0.3 },
  },
} as const;

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badge,
  newLevel,
  totalFinPoints,
  onClose,
}) => {
  return (
    <Overlay
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <ModalCard variants={modalVariants} onClick={(e) => e.stopPropagation()}>
        <Content>
          <Title>🎉 Conquista Desbloqueada!</Title>
          <Subtitle>
            Você alcançou um novo marco em sua jornada financeira!
          </Subtitle>

          <LevelUpBanner
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <TrendingUp />
            <span>Você subiu para o Nível {newLevel}!</span>
          </LevelUpBanner>

          <BadgeContainer
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
          >
            <BadgeIcon>{badge.icon}</BadgeIcon>
            <BadgeTitle>{badge.title}</BadgeTitle>
            <BadgeDescription>{badge.description}</BadgeDescription>
          </BadgeContainer>

          <StatsGrid>
            <StatCard>
              <StatIcon color="#FFA500">
                <Award />
              </StatIcon>
              <StatValue>{newLevel}</StatValue>
              <StatLabel>Nível Atual</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#007ACC">
                <Star />
              </StatIcon>
              <StatValue>{totalFinPoints}</StatValue>
              <StatLabel>Total FinPoints</StatLabel>
            </StatCard>
          </StatsGrid>

          <Button variant="primary" onClick={onClose} fullWidth>
            Continuar Jornada
          </Button>
        </Content>
      </ModalCard>
    </Overlay>
  );
};
