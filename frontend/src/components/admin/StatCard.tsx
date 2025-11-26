import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

const Card = styled(motion.div)<{ $color: string }>`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${props => props.$color};
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${props => `${props.$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: 8px;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1;
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle 
}) => {
  return (
    <Card
      $color={color}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <IconWrapper $color={color}>
        <Icon size={32} />
      </IconWrapper>
      <Content>
        <Title>{title}</Title>
        <Value>{value}</Value>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Content>
    </Card>
  );
};