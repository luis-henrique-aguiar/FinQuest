import styled from "styled-components";
import { motion } from "framer-motion";

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

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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

export const HeroSection = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}11 0%,
    ${({ theme }) => theme.colors.success}11 100%
  );
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.primary}22;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const HeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const HeroContent = styled.div`
  flex: 1;
  min-width: 280px;
`;

export const UpdateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.success};
  }
`;

export const MarketStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const MarketStatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.small};
    border-color: ${({ theme }) => theme.colors.primary}44;
  }

  .rate-name {
    font-size: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  .rate-value {
    font-size: 1.5rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1;
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.sm};

    .rate-value {
      font-size: 1.25rem;
    }
  }
`;

export const SimulatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  height: fit-content;
  position: relative;
  transition: border-color ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}33;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ResultContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  min-height: 500px;
  transition: border-color ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.success}33;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    min-height: 400px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
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

export const InvestmentSelectWrapper = styled.div`
  position: relative;
`;

export const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .period-label {
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .final-value {
    font-size: 2.75rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.success};
    margin: 0;
    line-height: 1;

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  .investment-name {
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const StatItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }

  .label {
    font-size: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  .value {
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const ChartSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  h4 {
    margin: 0;
    font-size: 1rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};

    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const ChartLegendCustom = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

export const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textMedium};

  &::before {
    content: "";
    width: 12px;
    height: 3px;
    border-radius: 2px;
    background: ${({ $color }) => $color};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMedium};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};

  .icon {
    font-size: 4rem;
    opacity: 0.6;
    filter: grayscale(30%);
  }

  h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    max-width: 320px;
    line-height: 1.6;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
  }
`;

export const InsightCard = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
  border-left: 4px solid ${({ theme }) => theme.colors.success};
  box-shadow: ${({ theme }) => theme.shadows.small};

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.success};
    font-size: 1.125rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin: 0;
    line-height: 1.7;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textDark};
  }

  strong {
    color: ${({ theme }) => theme.colors.success};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.white}ee;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  z-index: 10;
  gap: ${({ theme }) => theme.spacing.md};

  .spinner {
    color: ${({ theme }) => theme.colors.primary};
    animation: spin 1s linear infinite;
  }

  p {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;