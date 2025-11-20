import styled from "styled-components";

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
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
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h1`
  margin: 0;
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

export const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    justify-content: stretch;
    
    button {
      width: 100%;
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-color: ${({ theme }) => theme.colors.primary}33;
  }
`;

export const StatIcon = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ color }) => `${color}22`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: ${({ color }) => color};
  }
`;

export const StatContent = styled.div`
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 1.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.sm};

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.background};
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textMedium};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : `${theme.colors.primary}11`};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}22;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMedium};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 2px solid ${({ theme }) => theme.colors.border};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
    color: ${({ theme }) => theme.colors.textLight};
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 1.5rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  }

  p {
    margin: 0;
    font-size: 1.125rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ModalDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  line-height: 1.6;
  font-size: ${({ theme }) => theme.typography.fontSize.body};
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &[type="number"] {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const CelebrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.success};
    font-size: 2rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMedium};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: 1.125rem;
    line-height: 1.6;
    max-width: 400px;
  }
`;

export const LottieContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
  border-radius: 50%;
  font-size: 5rem;
  box-shadow: 0 8px 24px ${({ theme }) => theme.colors.success}22;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 4rem;
  }
`;