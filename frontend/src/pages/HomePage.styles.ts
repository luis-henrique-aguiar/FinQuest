import styled from 'styled-components';
import { motion } from 'framer-motion';
import Card from '../components/common/Card'; 

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const WelcomeSection = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const WelcomeText = styled.div`
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const DailyGoalsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const DailyGoalCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const GoalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

export const GoalProgress = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const MissionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ViewAllLink = styled.button`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const NotificationCard = styled(motion(Card))`
  background-color: ${({ theme }) => theme.colors.accent}1A;
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  
  h4 {
    margin: 0 0 0.25rem 0;
    color: ${({ theme }) => theme.colors.textDark};
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMedium};
  }
`;