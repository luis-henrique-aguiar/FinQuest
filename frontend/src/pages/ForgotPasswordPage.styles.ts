import styled from "styled-components";
import { motion } from "framer-motion";

export const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

export const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textMedium};
    margin: 0;
  }
`;

export const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: ${({ theme }) => theme.colors.error}1A;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

export const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
