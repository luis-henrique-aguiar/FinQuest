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
  transition: margin-left 0.3s ease-in-out;

  @media (min-width: 769px) {
    margin-left: 250px;
  }
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContentWrapper>
        <TopBar />
        <MainContent
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {children || <Outlet />}
        </MainContent>
      </MainContentWrapper>
    </LayoutContainer>
  );
};

export default AppLayout;
