import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

const StyledCard = styled(motion.div)<{
  variant: 'default' | 'elevated' | 'outlined';
  padding: 'none' | 'small' | 'medium' | 'large';
  interactive: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  
  ${({ variant, theme }) =>
    variant === 'default' &&
    css`
      box-shadow: ${theme.shadows.small};
    `}
  
  ${({ variant, theme }) =>
    variant === 'elevated' &&
    css`
      box-shadow: ${theme.shadows.medium};
    `}
  
  ${({ variant, theme }) =>
    variant === 'outlined' &&
    css`
      border: 1px solid ${theme.colors.textMedium}33;
      box-shadow: none;
    `}
  
  ${({ padding, theme }) =>
    padding === 'small' &&
    css`
      padding: ${theme.spacing.sm};
    `}
  
  ${({ padding, theme }) =>
    padding === 'medium' &&
    css`
      padding: ${theme.spacing.md};
    `}
  
  ${({ padding, theme }) =>
    padding === 'large' &&
    css`
      padding: ${theme.spacing.lg};
    `}
  
  ${({ interactive }) =>
    interactive &&
    css`
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        transform: translateY(-4px);
      }
    `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  onClick,
  interactive = !!onClick,
  className,
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      interactive={interactive}
      onClick={onClick}
      className={className}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      {children}
    </StyledCard>
  );
};

export default Card;