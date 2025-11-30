import React, { useState } from "react";
import styled from "styled-components";
import { Eye, EyeOff, Lock } from "react-feather";
import { Modal } from "../common/Modal";
import Button from "../common/Button";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333333;
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 3rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
  font-family: "Nunito Sans", sans-serif;
  transition: all 0.3s ease;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #6c757d;
  pointer-events: none;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}11;
  }
`;

const PasswordStrength = styled.div<{ $strength: number }>`
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

const PasswordHint = styled.div<{ $strength: number }>`
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SecurityTip = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #007acc 100%);
  background-size: 100% 4px;
  background-repeat: no-repeat;
  background-position: top;
  background-color: ${({ theme }) => theme.colors.primary}11;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 12px;

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMedium};
    line-height: 1.4;
  }
`;

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { firebaseUser, user, logout } = useAuth();

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 4);
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  const getStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return "Muito fraca";
      case 2:
        return "Fraca";
      case 3:
        return "Boa";
      case 4:
        return "Excelente";
      default:
        return "";
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      addToast("Senha atual é obrigatória", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      addToast("Nova senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      addToast("Nova senha e confirmação não coincidem", "error");
      return;
    }

    if (!user || !user.email || !firebaseUser) {
      addToast("Sessão inválida. Por favor, faça login novamente.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        formData.currentPassword
      );
      await reauthenticateWithCredential(firebaseUser, credential);

      await api.put("/users/password", {
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmPassword,
      });

      await logout();

      addToast(
        "Senha alterada com sucesso! Por segurança, você foi desconectado e deve fazer login novamente com sua nova senha.",
        "success"
      );
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (error: any) {
      let errorMessage = "Erro ao alterar senha. Tente novamente.";

      if (error?.response?.data?.details) {
        addToast(`${error.response.data.details[0]}`, "error");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage = "A senha atual digitada está incorreta.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A nova senha é muito fraca (mínimo 6 caracteres).";
      }

      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Alterar Senha">
      <Form onSubmit={handleSubmit}>
        <SecurityTip>
          <h4>
            <span>🔒</span>
            Dica de Segurança
          </h4>
          <p>
            Use uma senha forte com pelo menos 8 caracteres, incluindo letras
            maiúsculas, minúsculas, números e símbolos.
          </p>
        </SecurityTip>

        <InputGroup>
          <Label htmlFor="currentPassword">Senha Atual</Label>
          <PasswordInputContainer>
            <InputIcon>
              <Lock size={16} />
            </InputIcon>
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              placeholder="Digite sua senha atual"
              value={formData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => togglePasswordVisibility("current")}
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </PasswordInputContainer>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="newPassword">Nova Senha</Label>
          <PasswordInputContainer>
            <InputIcon>
              <Lock size={16} />
            </InputIcon>
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              placeholder="Digite sua nova senha"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => togglePasswordVisibility("new")}
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </PasswordInputContainer>
          {formData.newPassword && (
            <>
              <PasswordStrength $strength={passwordStrength}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </PasswordStrength>
              <PasswordHint $strength={passwordStrength}>
                Força da senha: {getStrengthText(passwordStrength)}
              </PasswordHint>
            </>
          )}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <PasswordInputContainer>
            <InputIcon>
              <Lock size={16} />
            </InputIcon>
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirme sua nova senha"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </PasswordInputContainer>
        </InputGroup>

        <ButtonsContainer>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {isLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </ButtonsContainer>
      </Form>
    </Modal>
  );
};
