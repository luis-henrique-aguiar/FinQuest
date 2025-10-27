import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  AlertCircle,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import * as S from "./RegisterPage.styles";
import { BenefitItem } from "../components/auth/BenefitItem";
import { InputGroup } from "../components/auth/InputGroup";
import mascotWaveAnimation from "../assets/animations/fox_greetings.json";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
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
    }
    // Consideramos força >= 2 como aceitável para registro
    else if (passwordStrength < 2 && password.length >= 6) {
      newErrors.password =
        "Senha muito fraca. Tente combinar letras maiúsculas, minúsculas, números ou símbolos.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 6) strength++; // Critério mínimo
    if (pass.length >= 10) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++; // Mix de caixa
    if (/\d/.test(pass)) strength++; // Números
    if (/[^a-zA-Z0-9]/.test(pass)) strength++; // Símbolos
    return Math.min(strength, 4); // Limita visualmente a 4 barras
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
    setErrors({}); // Limpa erros antigos
    if (!validateForm()) {
      addToast("Por favor, corrija os erros no formulário.", "error");
      return; // Interrompe se a validação local falhar
    }

    // Validação extra de força mínima para submeter
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
      // Chama a função 'register' real do AuthContext
      await register(name, email, password);

      addToast(
        `🎉 Bem-vindo(a) ao FinQuest, ${name}! Conta criada com sucesso.`,
        "success"
      );
      navigate("/home"); // Navega para a home APÓS o registro bem-sucedido
    } catch (error: any) {
      console.error("Erro no registro:", error);
      let errorMessage =
        "Ocorreu um erro inesperado ao criar sua conta. Tente novamente.";
      // Mapeia erros específicos do Firebase
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
        setErrors({ email: errorMessage });
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha fornecida é muito fraca pelo Firebase."; // Pode acontecer mesmo com nossa validação
        setErrors({ password: errorMessage });
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O formato do email fornecido é inválido.";
        setErrors({ email: errorMessage });
      } else {
        setErrors({ general: errorMessage }); // Erro geral
      }
      addToast(errorMessage, "error"); // Exibe o erro como Toast
    } finally {
      setIsLoading(false); // Desativa o loading
    }
  };

  // Animação para os shapes flutuantes de fundo
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 5, // Duração um pouco maior
      repeat: Infinity,
      ease: "easeInOut" as const,
      repeatType: "loop" as const,
    },
  };

  // Dados para os itens de benefício
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
          $color="#28A745" // Verde
          $size={400}
          $top="10%"
          $left="-10%"
          animate={{
            y: floatingAnimation.y,
            transition: floatingAnimation.transition,
          }}
        />
        <S.FloatingShape
          $color="#007ACC" // Azul
          $size={350}
          $top="70%"
          $left="80%"
          animate={{
            y: floatingAnimation.y,
            transition: { ...floatingAnimation.transition, delay: 1.5 }, // Delay diferente
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
          <S.MascotAnimationContainer
            animate={{
              y: [0, -10, 0], // Animação sutil
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          >
            {/* Usando a animação Lottie importada */}
            <Lottie animationData={mascotWaveAnimation} loop={true} />
          </S.MascotAnimationContainer>
          <h1>Junte-se ao FinQuest!</h1>
          <p>
            Transforme sua relação com o dinheiro de forma divertida e
            gamificada.
          </p>
          <S.BenefitsList>
            {benefits.map((item, index) => (
              <BenefitItem key={index} {...item} /> // Usando o componente BenefitItem
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

          {/* Usando FormElement como <form> */}
          <S.FormElement onSubmit={handleRegister} noValidate>
            {/* Input de Nome com Erro */}
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

            {/* Input de Email com Erro */}
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

            {/* Input de Senha com Indicador e Erro */}
            <S.InputGroupStyled>
              <S.Label htmlFor="password">Senha</S.Label>
              <S.InputWrapper>
                <Lock size={20} />
                <S.Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-hint password-error"
                />
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
              whileHover={!isLoading ? { scale: 1.02 } : undefined} // Desativa hover se loading
              whileTap={!isLoading ? { scale: 0.98 } : undefined} // Desativa tap se loading
              disabled={
                isLoading || !name || !email || !password || password.length < 6
              } // Mantém a lógica de disabled
            >
              {isLoading ? (
                <>
                  <S.Spinner /> {/* Mostra spinner se loading */}
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
