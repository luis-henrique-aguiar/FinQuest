import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const IconContainer = styled.div<{ $bgColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  box-shadow: 0 10px 30px ${props => props.$bgColor}40;
`;

export const FeatureCardStyled = styled(motion.div)`
  background: linear-gradient(135deg, rgba(0, 122, 204, 0.05) 0%, rgba(40, 167, 69, 0.05) 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 122, 204, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007ACC 0%, #28A745 100%);
  }
`;

interface FeatureCardProps {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  text: string;
  delay: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, iconBgColor, title, text, delay }) => {
  return (
    <FeatureCardStyled
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ scale: 1.02 }}
    >
      <IconContainer $bgColor={iconBgColor}>
        {icon}
      </IconContainer>
      <h3>{title}</h3>
      <p>{text}</p>
    </FeatureCardStyled>
  );
};