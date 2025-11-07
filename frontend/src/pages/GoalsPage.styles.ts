import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
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
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textDark};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : "#e5e7eb")};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
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

export const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMedium};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.white} 0%,
    ${({ theme }) => theme.colors.background} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 2px dashed ${({ theme }) => theme.colors.primary}33;

  .emoji {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    display: block;
    filter: grayscale(0.3);
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }
`;

// Estilos para os modais
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
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.colors.textMedium}33;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMedium};
  }

  &[type="number"] {
    -moz-appearance: textfield;

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
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const CelebrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 2rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 350px;
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
    ${({ theme }) => theme.colors.secondary}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
  border-radius: 50%;
  font-size: 4rem;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 3rem;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.background};
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMedium};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

export const FilterInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const ResultCount = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const ClearFilters = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;
