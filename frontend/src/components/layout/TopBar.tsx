import React from "react";
import styled from "styled-components";
import FinPoints from "../gamification/FinPoints";
import Streak from "../gamification/Streak";
import FoxLogo from "../../assets/images/fox.png";
import { motion } from "framer-motion";

const TopBarContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  height: 64px; // Altura fixa para consistência
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
  height: 30px; /* Ajuste o tamanho da sua logo aqui */
  width: auto;
  margin-right: 4px; // Pequeno espaço entre a raposa e o texto "FinQuest"
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const TopBar: React.FC = () => {
  // Mock data
  const userStats = {
    finpoints: 1250,
    coins: 350,
    streakDays: 7,
  };

  return (
    <TopBarContainer>
      <Logo>
        {/* Usando a imagem da raposa animada como logo */}
        <AnimatedFox
          src={FoxLogo}
          alt="FinQuest Fox Logo"
          initial={{ rotate: 0 }} // Estado inicial (opcional, para animações mais complexas)
          animate={{ rotate: [0, 10, -10, 0] }} // Animação de "balanço"
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 3,
          }} // Loop infinito
        />
        <span>FinQuest</span>
      </Logo>

      <UserStats>
        <Streak days={userStats.streakDays} />
      </UserStats>
    </TopBarContainer>
  );
};

export default TopBar;
