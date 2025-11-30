import styled from "styled-components";
import { motion } from "framer-motion";

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.animations.medium} ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const IconContainer = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => `${$color}22`};
  flex-shrink: 0;

  svg {
    width: 32px;
    height: 32px;
    color: ${({ $color }) => $color};
  }
`;

export const StatContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1;
`;

export const StatSubtext = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const TableSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

export const TableHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
`;

export const TableTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    transition: background ${({ theme }) => theme.animations.fast};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.background};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

export const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.animations.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
  vertical-align: middle;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const Badge = styled.span<{ $variant: "success" | "info" | "warning" }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  background: ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return `${theme.colors.success}22`;
      case "info":
        return `${theme.colors.primary}22`;
      case "warning":
        return `${theme.colors.warning}22`;
    }
  }};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return theme.colors.success;
      case "info":
        return theme.colors.primary;
      case "warning":
        return theme.colors.warning;
    }
  }};
`;

export const ActionButton = styled.button<{ $variant: "primary" | "outline" }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ $variant, theme }) => {
    if ($variant === "primary") {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        border-color: ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary}dd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${theme.colors.primary}44;
        }
      `;
    } else {
      return `
        background: transparent;
        color: ${theme.colors.primary};
        border-color: ${theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary}11;
          border-color: ${theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

export const PageInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const PageButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMedium};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
    color: ${({ theme }) => theme.colors.textLight};
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    color: ${({ theme }) => theme.colors.textDark};
  }

  p {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${({ theme }) => theme.spacing.md};

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.colors.backgroundAlt};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  p {
    color: ${({ theme }) => theme.colors.textMedium};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;