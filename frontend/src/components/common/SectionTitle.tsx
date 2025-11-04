import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Title = styled(motion.h2)`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}33;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

interface SectionTitleProps {
  children: ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <Title
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </Title>
  );
};

export default SectionTitle;