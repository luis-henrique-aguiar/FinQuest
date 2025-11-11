import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; // Acima de todo o resto
`;

export const ModalCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

export const AnimationContainer = styled.div`
  width: 180px;
  height: 180px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  font-size: 2.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const Text = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  strong {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;