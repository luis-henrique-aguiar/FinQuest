import React from "react";
import styled from "styled-components";
import { motion, type Transition } from "framer-motion";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left ${({ theme }) => theme.animations.medium} ease-in-out;

  @media (min-width: 769px) {
    margin-left: 280px; /* ✅ Atualizado para nova largura da sidebar */
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px; /* ✅ Aumentado para aproveitar mais espaço */
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContentWrapper>
        <TopBar />
        <ContentArea>
          <MainContent
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children || <Outlet />}
          </MainContent>
        </ContentArea>
      </MainContentWrapper>
    </LayoutContainer>
  );
};

export default AppLayout;