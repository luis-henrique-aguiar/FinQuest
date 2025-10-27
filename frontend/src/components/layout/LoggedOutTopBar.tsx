import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import FoxLogo from "../../assets/images/fox.png";

const TopBarContainer = styled.header`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 20px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  height: 30px;
  width: auto;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const LoggedOutTopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TopBarContainer>
      <Logo onClick={() => navigate("/")}>
        <LogoImage src={FoxLogo} alt="FinQuest Logo" />
        <span>FinQuest</span>
      </Logo>
      <AuthButtons>
        <Button variant="outline" onClick={() => navigate("/login")}>
          Entrar
        </Button>
        <Button variant="primary" onClick={() => navigate("/register")}>
          Criar Conta
        </Button>
      </AuthButtons>
    </TopBarContainer>
  );
};
