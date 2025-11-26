import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 400px;

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.colors.backgroundAlt};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  p {
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 1rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
  }
`;

export const HeroSection = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}11 0%,
    ${({ theme }) => theme.colors.success}11 100%
  );
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.primary}22;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const HeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 968px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const HeroContent = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 2rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

export const MonthButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}11;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MonthDisplay = styled.div`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
  text-transform: capitalize;
  min-width: 180px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    min-width: 150px;
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme.colors.white};
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textMedium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.primary + '11'};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.white : theme.colors.primary};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled(motion.div)<{ $highlight?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.3s ease;
  border: 2px solid ${({ theme, $highlight }) =>
    $highlight ? theme.colors.accent : 'transparent'};

  ${({ $highlight, theme }) =>
    $highlight &&
    css`
      background: linear-gradient(
        135deg,
        ${theme.colors.accent}08 0%,
        ${theme.colors.accent}12 100%
      );
    `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

export const StatIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ $color }) => `${$color}18`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 28px;
    height: 28px;
    color: ${({ $color }) => $color};
  }
`;

export const StatContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $color, theme }) => $color || theme.colors.textDark};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const StatChange = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ $positive, theme }) =>
    $positive ? theme.colors.success : theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ChartsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ChartTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const ChartSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}08;
  }
`;

export const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CategoryDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

export const CategoryName = styled.span`
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const CategoryValue = styled.span`
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const CategoryPercentage = styled.span`
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

export const InsightsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const InsightCard = styled(motion.div)<{ $type: 'success' | 'warning' | 'info' }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  border-left: 4px solid ${({ $type, theme }) => {
    switch ($type) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.primary;
      default: return theme.colors.primary;
    }
  }};
  background: ${({ $type, theme }) => {
    switch ($type) {
      case 'success': return `${theme.colors.success}08`;
      case 'warning': return `${theme.colors.warning}08`;
      case 'info': return `${theme.colors.primary}08`;
      default: return theme.colors.white;
    }
  }};
`;

export const InsightIcon = styled.div`
  flex-shrink: 0;
`;

export const InsightContent = styled.div`
  flex: 1;
`;

export const InsightTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const InsightText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.6;

  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  }
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  .icon {
    font-size: 4rem;
    opacity: 0.6;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
  }

  p {
    margin: 0;
    font-size: 1rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    max-width: 400px;
    line-height: 1.6;
  }
`;