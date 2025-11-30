import styled, { css } from "styled-components";
import { motion } from "framer-motion";

export const PageContainer = styled.div`
  max-width: 1200px;
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
    ${({ theme }) => theme.colors.accent}11 100%
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

  @media (max-width: 768px) {
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    font-size: 0.9rem;
    min-width: 150px;
  }
`;

export const CurrentBadge = styled.span`
  font-size: 0.6rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  background: ${({ theme }) => theme.colors.accent};
  color: #333333;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
    $highlight ? theme.colors.success : 'transparent'};

  ${({ $highlight, theme }) =>
    $highlight &&
    css`
      background: linear-gradient(
        135deg,
        ${theme.colors.success}08 0%,
        ${theme.colors.success}12 100%
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

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const SectionActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const TransactionCard = styled(motion.div)<{ $type: "INCOME" | "EXPENSE" }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;
  border-left: 4px solid ${({ $type }) => 
    $type === "INCOME" ? "#28A745" : "#DC3545"};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const TransactionIcon = styled.div<{ $type: "INCOME" | "EXPENSE" }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ $type }) => 
    $type === "INCOME" ? "#28A74518" : "#DC354518"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $type }) => 
      $type === "INCOME" ? "#28A745" : "#DC3545"};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TransactionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TransactionTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const TransactionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

export const CategoryBadge = styled.span`
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}15;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const DateText = styled.span`
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textLight};
`;

export const NotesText = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: 0.8rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TransactionRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

export const TransactionAmount = styled.div<{ $type: "INCOME" | "EXPENSE" }>`
  font-size: 1.25rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $type }) => ($type === "INCOME" ? "#28A745" : "#DC3545")};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};

  button {
    background: none;
    border: none;
    padding: ${({ theme }) => theme.spacing.sm};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textMedium};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.primary}11;
    }

    &:last-child:hover {
      color: #dc3545;
      background-color: #dc354511;
    }
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

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ModalDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
  font-size: 0.95rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &[type="number"] {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: not-allowed;
    opacity: 0.7;
  }

  option {
    padding: 0.5rem;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;