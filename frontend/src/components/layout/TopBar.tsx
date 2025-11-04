import React from "react";
import styled from "styled-components";
import FoxLogo from "../../assets/images/fox.png";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import FinPoints from "../gamification/FinPoints";

const TopBarContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textDark};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AnimatedFox = styled(motion.img)`
  height: 30px;
  width: auto;
  margin-right: 4px;
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const TopBar: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <TopBarContainer>
      <Logo>
        <AnimatedFox
          src={FoxLogo}
          alt="FinQuest Fox Logo"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 3,
          }}
        />
        <span>FinQuest</span>
      </Logo>

      <UserStats>
        <FinPoints points={user.totalFinPoints} />
      </UserStats>
    </TopBarContainer>
  );
};

export default TopBar;
