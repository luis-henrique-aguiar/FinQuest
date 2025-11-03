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

export const FloatingShape = styled(motion.div)<{ $color: string; $size: number; $top: string; $left: string }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  top: ${props => props.$top};
  left: ${props => props.$left};
`;

// Left Side - Branding
export const BrandingSide = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #007ACC 0%, #28A745 100%);
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
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1rem;
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
  padding: 1rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 90px;
  }
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 3rem;
  margin-top: 3rem;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 2rem;
    margin-top: 2rem;
  }
`;

export const StatItem = styled(motion.div)`
  text-align: center;

  h3 {
    font-size: 2.5rem;
    color: #FFCC00;
    margin: 0;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }

  p {
    font-size: 0.9rem;
    margin: 0.5rem 0 0;
    opacity: 0.9;
  }
`;

// Right Side - Form
export const FormSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #FFFFFF;
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
    color: #6C757D;
    font-size: 1.1rem;
    margin: 0;
  }
`;

export const DemoCredentials = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.1) 0%, rgba(253, 126, 20, 0.1) 100%);
  border-left: 4px solid #FFCC00;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: start;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  div {
    flex: 1;

    h4 {
      margin: 0 0 0.5rem;
      color: #333333;
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #6C757D;
      
      strong {
        color: #333333;
        font-family: 'Courier New', monospace;
        background: rgba(0, 0, 0, 0.05);
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
  }
`;

export const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
    color: #6C757D;
    pointer-events: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  font-size: 1rem;
  font-family: 'Nunito Sans', sans-serif;
  transition: all 0.3s ease;
  background: #FFFFFF;

  &:focus {
    outline: none;
    border-color: #007ACC;
    box-shadow: 0 0 0 4px rgba(0, 122, 204, 0.15);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

export const SubmitButtonStyled = styled(motion.button)`
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #007ACC 0%, #28A745 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 122, 204, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 122, 204, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ForgotPassword = styled.button`
  color: #007ACC;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: right;
  transition: opacity 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: 'Nunito Sans', sans-serif;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: #6C757D;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E5E7EB;
  }
`;

export const SignUpPrompt = styled.div`
  text-align: center;
  color: #6C757D;
  font-size: 1rem;

  button {
    color: #007ACC;
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
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: -0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
