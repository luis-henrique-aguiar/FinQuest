import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

type BadgeLevel = 'bronze' | 'silver' | 'gold';
type BadgeSize = 'small' | 'medium' | 'large';
type BadgeStatus = 'locked' | 'unlocked';

interface BadgeProps {
  level: BadgeLevel;
  size?: BadgeSize;
  status?: BadgeStatus;
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
}

const BadgeContainer = styled(motion.div)<{
  level: BadgeLevel;
  size: BadgeSize;
  status: BadgeStatus;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

const BadgeCircle = styled(motion.div)<{
  level: BadgeLevel;
  size: BadgeSize;
  status: BadgeStatus;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  
  ${({ size }) =>
    size === 'small' &&
    css`
      width: 48px;
      height: 48px;
    `}
  
  ${({ size }) =>
    size === 'medium' &&
    css`
      width: 64px;
      height: 64px;
    `}
  
  ${({ size }) =>
    size === 'large' &&
    css`
      width: 96px;
      height: 96px;
    `}
  
  ${({ level, status }) => {
    if (status === 'locked') {
      return css`
        background-color: #d1d1d1;
        opacity: 0.5;
      `;
    }
    
    switch (level) {
      case 'bronze':
        return css`
          background: linear-gradient(135deg, #CD7F32, #A46628);
          box-shadow: 0 4px 8px rgba(205, 127, 50, 0.3);
        `;
      case 'silver':
        return css`
          background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
          box-shadow: 0 4px 8px rgba(192, 192, 192, 0.3);
        `;
      case 'gold':
        return css`
          background: linear-gradient(135deg, #FFD700, #FFC000);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        `;
      default:
        return '';
    }
  }}
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    transition: all 0.3s ease;
  }
  
  ${({ status }) =>
    status === 'unlocked' &&
    css`
      &:hover::after {
        left: 100%;
      }
    `}
`;

const IconWrapper = styled.div<{ size: BadgeSize; status: BadgeStatus }>`
  color: ${({ status }) => (status === 'locked' ? '#888' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ size }) =>
    size === 'small' &&
    css`
      font-size: 24px;
    `}
  
  ${({ size }) =>
    size === 'medium' &&
    css`
      font-size: 32px;
    `}
  
  ${({ size }) =>
    size === 'large' &&
    css`
      font-size: 48px;
    `}
`;

const BadgeLabel = styled.span<{ status: BadgeStatus }>`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ status, theme }) =>
    status === 'locked' ? theme.colors.textMedium : theme.colors.textDark};
  text-align: center;
  max-width: 100px;
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

export const Badge: React.FC<BadgeProps> = ({
  level,
  size = 'medium',
  status = 'unlocked',
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <BadgeContainer
      level={level}
      size={size}
      status={status}
      onClick={onClick}
      className={className}
      whileHover={status === 'unlocked' && onClick ? { scale: 1.05 } : {}}
      whileTap={status === 'unlocked' && onClick ? { scale: 0.95 } : {}}
    >
      <BadgeCircle level={level} size={size} status={status}>
        <IconWrapper size={size} status={status}>
          {icon}
        </IconWrapper>
        {status === 'locked' && <LockOverlay>🔒</LockOverlay>}
      </BadgeCircle>
      {label && <BadgeLabel status={status}>{label}</BadgeLabel>}
    </BadgeContainer>
  );
};

export default Badge;