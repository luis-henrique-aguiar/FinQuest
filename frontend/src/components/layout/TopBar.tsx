import React from "react";
import styled from "styled-components";
import FoxLogo from "../../assets/images/fox.png";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const TopBarContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.small};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    padding-left: 70px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AnimatedFox = styled(motion.img)`
  height: 40px;
  width: auto;
  filter: drop-shadow(0 2px 8px ${({ theme }) => theme.colors.primary}44);
  transition: filter ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    filter: drop-shadow(0 4px 12px ${({ theme }) => theme.colors.primary}66);
  }
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const BrandName = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  line-height: 1;
`;

const BrandTagline = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const StatBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  cursor: default;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}22;
  }

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

const CoinIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(255, 165, 0, 0.3));

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

export const TopBar: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString('pt-BR');
  };

  return (
    <TopBarContainer>
      <LogoSection>
        <AnimatedFox
          src={FoxLogo}
          alt="FinQuest Fox Logo"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 3,
          }}
        />
        <BrandText>
          <BrandName>FinQuest</BrandName>
          <BrandTagline>Educação Financeira Gamificada</BrandTagline>
        </BrandText>
      </LogoSection>

      <StatsContainer>
        <StatBadge
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CoinIcon>💎</CoinIcon>
          <StatValue>{formatNumber(user.totalFinPoints)}</StatValue>
        </StatBadge>
      </StatsContainer>
    </TopBarContainer>
  );
};

export default TopBar;