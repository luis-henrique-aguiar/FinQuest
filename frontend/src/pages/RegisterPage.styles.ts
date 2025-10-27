import { motion } from "framer-motion";
import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

// Animated Background
export const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

export const FloatingShape = styled(motion.div)<{
  $color: string;
  $size: number;
  $top: string;
  $left: string;
}>`
  position: absolute;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  background: ${(props) => props.$color};
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
`;

// Left Side - Branding
export const BrandingSide = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #28a745 0%, #007acc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  position: relative;
  color: white;
  text-align: center;
  border-radius: 10px;

  @media (max-width: 968px) {
    min-height: 40vh;
    padding: 2rem 1rem;
  }
`;

export const BrandingContent = styled(motion.div)`
  max-width: 500px;
  z-index: 1;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: white;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
    line-height: 1.6;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 2rem;
    }
  }
`;

export const MascotContainer = styled(motion.div)`
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 90px;
  }
`;

export const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
`;

export const BenefitItemStyled = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  svg {
    flex-shrink: 0;
    color: #ffcc00;
  }

  div {
    h4 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: bold;
      color: white;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }
`;

// Right Side - Form
export const FormSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #ffffff;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    padding: 3rem 1.5rem;
  }
`;

export const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 480px;
`;

export const FormHeader = styled.div`
  margin-bottom: 3rem;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #333333;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
    margin: 0;
  }
`;

export const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const MascotAnimationContainer = styled(motion.div)`
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

export const InputGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333333;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 1rem;
    color: #6c757d;
    pointer-events: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
  font-family: "Nunito Sans", sans-serif;
  transition: all 0.3s ease;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const PasswordStrength = styled.div<{ $strength: number }>`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;

  span {
    flex: 1;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    transition: all 0.3s ease;

    &:nth-child(-n + ${(props) => props.$strength}) {
      background: ${(props) => {
        if (props.$strength <= 1) return "#DC3545";
        if (props.$strength <= 2) return "#FD7E14";
        if (props.$strength <= 3) return "#FFCC00";
        return "#28A745";
      }};
    }
  }
`;

export const PasswordHint = styled.div<{ $strength: number }>`
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: ${(props) => {
    if (props.$strength <= 1) return "#DC3545";
    if (props.$strength <= 2) return "#FD7E14";
    if (props.$strength <= 3) return "#FFCC00";
    return "#28A745";
  }};
  font-weight: 500;
`;

export const SubmitButton = styled(motion.button)`
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #28a745 0%, #007acc 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgba(40, 167, 69, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const TermsText = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
  text-align: center;
  line-height: 1.5;

  button {
    color: #007acc;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

export const LoginPrompt = styled.div`
  text-align: center;
  color: #6c757d;
  font-size: 1rem;

  button {
    color: #007acc;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    font-size: inherit;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error}; /* Usa a cor de erro do tema */
  font-size: 0.85rem; /* Tamanho pequeno */
  font-weight: 500; /* Levemente destacado */
  margin-top: -0.75rem; /* Puxa para mais perto do input acima */
  margin-bottom: 0.5rem; /* Adiciona espaço antes do próximo elemento */
  display: flex; /* Para alinhar o ícone com o texto */
  align-items: center; /* Centraliza verticalmente o ícone */
  gap: 0.3rem; /* Espaço entre o ícone e o texto */
`;

// Lembre-se também de adicionar o Spinner se ainda não o fez:
export const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3); /* Cor base do spinner */
  border-top: 2px solid #fff; /* Cor da parte que gira */
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
