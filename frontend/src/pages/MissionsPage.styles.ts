import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}11 0%, ${({ theme }) => theme.colors.accent}11 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.primary}22;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const ProgressTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const ProgressStats = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.background};
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.textMedium}33;
    border-radius: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
    margin-left: -${({ theme }) => theme.spacing.sm};
    margin-right: -${({ theme }) => theme.spacing.sm};
  }
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textDark};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : '#e5e7eb'};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: "Nunito Sans", sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: fit-content;
  
  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.primary}11;
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}22;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const MissionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMedium};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textDark};
  }
  
  p {
    margin: 0;
    font-size: 1rem;
  }
  
  .emoji {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: block;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.background};
  text-align: center;
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMedium};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;