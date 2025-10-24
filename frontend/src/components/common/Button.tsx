import React from 'react'; // Importação do React é necessária para React.CSSProperties
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  'data-testid'?: string;
}

type ButtonProps = ButtonOwnProps;

const ButtonContainer = styled(motion.button)<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  ${({ $iconPosition }) =>
    $iconPosition === 'right' &&
    css`
      flex-direction: row-reverse;
  `}
  
  /* Size variants */
  ${({ $size, theme }) =>
    $size === 'small' &&
    css`
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: 14px;
  `}
  
  ${({ $size, theme }) =>
    $size === 'medium' &&
    css`
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.button};
  `}
  
  ${({ $size, theme }) =>
    $size === 'large' &&
    css`
      padding: ${theme.spacing.md} ${theme.spacing.xl};
      font-size: 18px;
  `}
  
  /* Style variants */
  ${({ $variant, theme }) =>
    $variant === 'primary' &&
    css`
      background-color: ${theme.colors.accent};
      color: #333333; 
      border: none;
      box-shadow: ${theme.shadows.small};
      
      &:hover {
        background-color: #${theme.colors.accent.substring(1)}dd;
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.medium};
      }
      
      &:active {
        transform: translateY(0);
      }
      
      &:disabled {
        background-color: ${theme.colors.textMedium};
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
  `}
  
  ${({ $variant, theme }) =>
    $variant === 'secondary' &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
      border: none;
      
      &:hover {
        background-color: #${theme.colors.primary.substring(1)}dd;
      }
      
      &:disabled {
        background-color: ${theme.colors.textMedium};
        cursor: not-allowed;
      }
  `}
  
  ${({ $variant, theme }) =>
    $variant === 'outline' &&
    css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 2px solid ${theme.colors.primary};
      
      &:hover {
        background-color: #${theme.colors.primary.substring(1)}11;
      }
      
      &:disabled {
        border-color: ${theme.colors.textMedium};
        color: ${theme.colors.textMedium};
        cursor: not-allowed;
      }
  `}
  
  ${({ $variant, theme }) =>
    $variant === 'text' &&
    css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: none;
      padding-left: ${theme.spacing.sm};
      padding-right: ${theme.spacing.sm};
      
      &:hover {
        background-color: #${theme.colors.primary.substring(1)}11;
      }
      
      &:disabled {
        color: ${theme.colors.textMedium};
        cursor: not-allowed;
      }
  `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  className,
  disabled,
  type = 'button',
  style,
  'data-testid': dataTestId,
}) => {
  return (
    <ButtonContainer
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $hasIcon={!!icon}
      $iconPosition={iconPosition}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
      style={style}
      data-testid={dataTestId}
    >
      {icon && icon}
      {children}
    </ButtonContainer>
  );
};

export default Button;