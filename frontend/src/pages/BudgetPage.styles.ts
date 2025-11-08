import styled, { css } from "styled-components";
import Card from "../components/common/Card";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const SummaryCard = styled(Card)<{
  highlight?: boolean;
  $textColor?: string;
}>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ highlight, theme }) =>
    highlight &&
    css`
      border-color: ${theme.colors.accent};
      background: linear-gradient(
        135deg,
        ${theme.colors.accent}11 0%,
        ${theme.colors.accent}22 100%
      );
      box-shadow: 0 4px 20px ${theme.colors.accent}33;
    `}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 1rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  p {
    margin: 0;
    font-size: 1.75rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $textColor, theme }) => $textColor || theme.colors.textDark};

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

export const BudgetSetupCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.white} 0%,
    ${({ theme }) => theme.colors.background} 100%
  );
  border: 2px dashed ${({ theme }) => theme.colors.primary}33;

  h4 {
    margin: 0;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMedium};
    line-height: 1.6;
    max-width: 400px;
  }
`;

export const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const TransactionItem = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;
  border-left: 4px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-left-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const TransactionInfo = styled.div`
  flex-grow: 1;

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const CategoryTag = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textDark};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}22 0%,
    ${({ theme }) => theme.colors.primary}11 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const TransactionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

export const TransactionAmount = styled.p<{ $type: "income" | "expense" }>`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 1.1rem;
  color: ${({ $type }) => ($type === "income" ? "#28A745" : "#DC3545")};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};

  button {
    background: none;
    border: none;
    padding: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textMedium};
    border-radius: ${({ theme }) => theme.borderRadius.small};
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

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMedium};

  p {
    margin: 0;
    font-size: 1.1rem;
  }
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
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.colors.textMedium}33;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  option {
    padding: 0.5rem;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.textDark};
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

export const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const MonthButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
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
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  text-transform: capitalize;
  min-width: 250px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    font-size: 1.1rem;
    min-width: 200px;
  }
`;

export const CurrentBadge = styled.span`
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: ${({ theme }) => theme.colors.accent};
  color: #333333;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
