import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface FinPointsProps {
  points: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

const Container = styled(motion.div)<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme, size }) => 
    size === 'small' ? theme.spacing.xs : 
    size === 'medium' ? theme.spacing.sm : 
    theme.spacing.md
  };
`;

const IconContainer = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => 
    size === 'small' ? '16px' : 
    size === 'medium' ? '24px' : 
    '32px'
  };
  color: ${({ theme }) => theme.colors.primary};
`;

const PointsText = styled.span<{ size: 'small' | 'medium' | 'large' }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ size }) => 
    size === 'small' ? '14px' : 
    size === 'medium' ? '18px' : 
    '24px'
  };
  color: ${({ theme }) => theme.colors.textDark};
`;

const Label = styled.span<{ size: 'small' | 'medium' | 'large' }>`
  font-size: ${({ size }) => 
    size === 'small' ? '10px' : 
    size === 'medium' ? '12px' : 
    '14px'
  };
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const FinPoints: React.FC<FinPointsProps> = ({
  points,
  size = 'medium',
  showLabel = true,
  className,
}) => {

  const formattedPoints = points.toLocaleString('pt-BR');
  
  return (
    <Container 
      size={size} 
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconContainer size={size}>💎</IconContainer>
      <div>
        <PointsText size={size}>{formattedPoints}</PointsText>
        {showLabel && <Label size={size}>FinPoints</Label>}
      </div>
    </Container>
  );
};

export default FinPoints;