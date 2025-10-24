import styled from "styled-components";
import { motion } from "framer-motion";

export const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const SlidesWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  display: flex;
  overflow: hidden;
`;

export const Slide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

export const AnimationContainer = styled.div`
  width: 250px;
  height: 250px;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const Text = styled.p`
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
`;

export const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2rem;
  width: 100%;
`;

export const DotsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "#D1D5DB"};
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;
`;
