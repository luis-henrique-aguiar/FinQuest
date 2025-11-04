import React, { useState, type FormEvent } from "react";
import { Mail, Lock, ArrowRight, AlertCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import * as S from "./LoginPage.styles";
import { InputGroup } from "../components/auth/InputGroup";
import mascotWaveAnimation from "../assets/animations/fox_greetings.json";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor, preencha o email e a senha.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      addToast("Bem-vindo(a) de volta.", "success");
      navigate("/home");
    } catch (error: any) {
      console.error("Erro no login:", error);
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-email"
      ) {
        errorMessage = "Email ou senha inválidos. Verifique suas credenciais.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Muitas tentativas de login. Tente novamente mais tarde.";
      }
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
      repeatType: "loop" as const,
    },
  };

  return (
    <S.PageContainer>
      <S.BackgroundShapes>
        <S.FloatingShape
          $color="#007ACC"
          $size={400}
          $top="20%"
          $left="-10%"
          animate={{
            y: floatingAnimation.y,
            transition: floatingAnimation.transition,
          }}
        />
        <S.FloatingShape
          $color="#28A745"
          $size={350}
          $top="60%"
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
          transition={{ duration: 0.8 }}
        >
          <S.MascotContainer
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" as const,
              repeatType: "loop" as const,
            }}
          >
            <Lottie animationData={mascotWaveAnimation} loop={true} />
          </S.MascotContainer>
          <h1>Bem-vindo de volta!</h1>
          <p>
            Continue sua jornada de educação financeira e conquiste novos
            objetivos hoje.
          </p>

          <S.StatsRow>
            <S.StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3>7d</h3>
              <p>Ofensiva</p>
            </S.StatItem>
            <S.StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3>1.2k</h3>
              <p>FinPoints</p>
            </S.StatItem>
            <S.StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h3>12</h3>
              <p>Conquistas</p>
            </S.StatItem>
          </S.StatsRow>
        </S.BrandingContent>
      </S.BrandingSide>

      {/* --- Lado Direito (Formulário) --- */}
      <S.FormSide>
        <S.FormContainer
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <S.FormHeader>
            <h2>Entrar</h2>
            <p>Acesse sua conta e continue aprendendo</p>
          </S.FormHeader>

          <S.FormElement onSubmit={handleLogin} noValidate>
            <InputGroup
              id="email"
              label="Email"
              icon={<Mail size={20} />}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!error}
            />

            <S.InputGroupStyled>
              <S.Label htmlFor="password">Senha</S.Label>
              <S.InputWrapper>
                <Lock size={20} />
                <S.Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!!error}
                  aria-describedby="login-error"
                />
              </S.InputWrapper>
              <S.ForgotPassword
                type="button"
                onClick={() => navigate('/forgot-password')}
              >
                Esqueceu sua senha?
              </S.ForgotPassword>
            </S.InputGroupStyled>

            {/* Exibe erro geral de login */}
            {error && (
              <S.ErrorMessage id="login-error" role="alert">
                <AlertCircle size={14} /> {error}
              </S.ErrorMessage>
            )}

            <S.SubmitButtonStyled
              type="submit"
              whileHover={!isLoading ? { scale: 1.02 } : undefined}
              whileTap={!isLoading ? { scale: 0.98 } : undefined}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <S.Spinner />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar na minha conta</span>
                  <ArrowRight size={20} />
                </>
              )}
            </S.SubmitButtonStyled>
          </S.FormElement>

          <S.Divider>ou</S.Divider>

          <S.SignUpPrompt>
            Ainda não tem uma conta?{" "}
            <button type="button" onClick={() => navigate("/register")}>
              Cadastre-se gratuitamente
            </button>
          </S.SignUpPrompt>
        </S.FormContainer>
      </S.FormSide>
    </S.PageContainer>
  );
};

export default LoginPage;