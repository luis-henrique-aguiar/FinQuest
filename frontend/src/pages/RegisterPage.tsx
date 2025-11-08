import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  AlertCircle,
  EyeOff,
  Eye,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import * as S from "./RegisterPage.styles";
import { BenefitItem } from "../components/auth/BenefitItem";
import { InputGroup } from "../components/auth/InputGroup";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email é obrigatório.";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Formato de email inválido.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres.";
      isValid = false;
    } else if (passwordStrength < 2 && password.length >= 6) {
      newErrors.password =
        "Senha muito fraca. Tente combinar letras maiúsculas, minúsculas, números ou símbolos.";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const getPasswordStrengthText = (): string => {
    if (password.length === 0) return "";
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Senha fraca";
      case 2:
        return "Senha razoável";
      case 3:
        return "Senha boa";
      case 4:
      case 5:
        return "Senha forte!";
      default:
        return "";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) {
      addToast("Por favor, corrija os erros no formulário.", "error");
      return;
    }

    if (passwordStrength < 2) {
      setErrors({
        password:
          "Senha muito fraca. Tente combinar letras maiúsculas, minúsculas, números ou símbolos.",
      });
      addToast("Por favor, use uma senha mais forte.", "error");
      return;
    }
    setIsLoading(true);

    try {
      await register(name, email, password);

      addToast(`🎉 Bem-vindo(a) ao FinQuest, ${name}!`, "success");
      navigate("/home");
    } catch (error: any) {
      console.error("Erro no registro:", error);
      let errorMessage =
        "Ocorreu um erro inesperado ao criar sua conta. Tente novamente.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
        setErrors({ email: errorMessage });
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha fornecida é muito fraca pelo Firebase.";
        setErrors({ password: errorMessage });
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O formato do email fornecido é inválido.";
        setErrors({ email: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      repeatType: "loop" as const,
    },
  };

  const benefits = [
    {
      icon: <Check size={24} />,
      title: "100% Gratuito",
      description: "Sem taxas ocultas, sempre",
      delay: 0.2,
    },
    {
      icon: <Check size={24} />,
      title: "Aprenda Jogando",
      description: "Missões e recompensas diárias",
      delay: 0.3,
    },
    {
      icon: <Check size={24} />,
      title: "Trilhas Personalizadas",
      description: "Conteúdo adaptado ao seu nível",
      delay: 0.4,
    },
  ];

  return (
    <S.PageContainer>
      {/* --- Formas Flutuantes de Fundo --- */}
      <S.BackgroundShapes>
        <S.FloatingShape
          $color="#28A745"
          $size={400}
          $top="10%"
          $left="-10%"
          animate={{
            y: floatingAnimation.y,
            transition: floatingAnimation.transition,
          }}
        />
        <S.FloatingShape
          $color="#007ACC"
          $size={350}
          $top="70%"
          $left="80%"
          animate={{
            y: floatingAnimation.y,
            transition: { ...floatingAnimation.transition, delay: 1.5 },
          }}
        />
      </S.BackgroundShapes>

      {/* --- Lado Esquerdo (Branding) --- */}
      <S.BrandingSide>
        <S.BrandingContent
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>Junte-se ao FinQuest!</h1>
          <p>
            Transforme sua relação com o dinheiro de forma divertida e
            gamificada.
          </p>
          <S.BenefitsList>
            {benefits.map((item, index) => (
              <BenefitItem key={index} {...item} />
            ))}
          </S.BenefitsList>
        </S.BrandingContent>
      </S.BrandingSide>

      {/* --- Lado Direito (Formulário) --- */}
      <S.FormSide>
        <S.FormContainer
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <S.FormHeader>
            <h2>Criar Conta</h2>
            <p>Comece sua jornada financeira hoje</p>
          </S.FormHeader>

          <S.FormElement onSubmit={handleRegister} noValidate>
            <InputGroup
              id="name"
              label="Nome Completo"
              icon={<User size={20} />}
              type="text"
              placeholder="Como você quer ser chamado?"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              required
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
            />
            {errors.name && (
              <S.ErrorMessage id="name-error">
                <AlertCircle size={14} /> {errors.name}
              </S.ErrorMessage>
            )}

            <InputGroup
              id="email"
              label="Email"
              icon={<Mail size={20} />}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              required
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <S.ErrorMessage id="email-error">
                <AlertCircle size={14} /> {errors.email}
              </S.ErrorMessage>
            )}

            <S.InputGroupStyled>
              <S.Label htmlFor="password">Senha</S.Label>
              <S.InputWrapper>
                <Lock size={20} />
                <S.Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-hint password-error"
                />
                <S.PasswordToggleIcon
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </S.PasswordToggleIcon>
              </S.InputWrapper>
              {/* Indicador de Força */}
              {password.length > 0 && (
                <>
                  <S.PasswordStrength $strength={passwordStrength}>
                    <span />
                    <span />
                    <span />
                    <span />
                  </S.PasswordStrength>
                  <S.PasswordHint
                    id="password-hint"
                    $strength={passwordStrength}
                  >
                    {getPasswordStrengthText()}
                  </S.PasswordHint>
                </>
              )}
            </S.InputGroupStyled>
            {errors.password && (
              <S.ErrorMessage id="password-error">
                <AlertCircle size={14} /> {errors.password}
              </S.ErrorMessage>
            )}

            <S.InputGroupStyled>
              <S.Label htmlFor="confirmPassword">Confirmar Senha</S.Label>
              <S.InputWrapper>
                <Lock size={20} />
                <S.Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby="confirmPassword-error"
                />
                {/* Ícone de "olho" para mostrar/ocultar */}
                <S.PasswordToggleIcon
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </S.PasswordToggleIcon>
              </S.InputWrapper>
            </S.InputGroupStyled>
            {errors.confirmPassword && (
              <S.ErrorMessage id="confirmPassword-error">
                <AlertCircle size={14} /> {errors.confirmPassword}
              </S.ErrorMessage>
            )}

            <S.TermsText>
              Ao criar conta, você concorda com nossos{" "}
              <button type="button" onClick={() => navigate("/terms")}>
                Termos
              </button>{" "}
              e{" "}
              <button type="button" onClick={() => navigate("/privacy")}>
                Privacidade
              </button>
              .
            </S.TermsText>

            {/* Erro Geral */}
            {errors.general && (
              <S.ErrorMessage role="alert">
                <AlertCircle size={14} /> {errors.general}
              </S.ErrorMessage>
            )}

            {/* Botão com Estado de Loading */}
            <S.SubmitButton
              type="submit"
              whileHover={!isLoading ? { scale: 1.02 } : undefined}
              whileTap={!isLoading ? { scale: 0.98 } : undefined}
              disabled={
                isLoading || !name || !email || !password || password.length < 6
              }
            >
              {isLoading ? (
                <>
                  <S.Spinner />
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <span>Criar Minha Conta</span>
                  <ArrowRight size={20} />
                </>
              )}
            </S.SubmitButton>
          </S.FormElement>

          <S.Divider>ou</S.Divider>

          <S.LoginPrompt>
            Já tem uma conta?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Faça login
            </button>
          </S.LoginPrompt>
        </S.FormContainer>
      </S.FormSide>
    </S.PageContainer>
  );
};

export default RegisterPage;
