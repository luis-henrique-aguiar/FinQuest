import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useState } from "react";
import * as S from "./LoginPage.styles";
import Lottie from "lottie-react";
import { AlertCircle, ArrowRight, Info, Mail, Lock } from "react-feather";
import { InputGroup } from "../components/auth/InputGroup";
import mascotWaveAnimation from "../assets/animations/fox_greetings.json";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantemos isso apenas para exibição no card de demo
  const DEFAULT_USER = {
    email: "admin@finquest.com",
    password: "password123", // Senha mais forte para demo
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Chama a função 'login' real do AuthContext
      await login(email, password);

      addToast("Login realizado com sucesso!", "success");
      navigate("/home"); // Redireciona para a dashboard principal
    } catch (error: any) {
      console.error("Erro no login:", error);
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      // Mapeia erros comuns do Firebase
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
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

  // Animação para os shapes flutuantes
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const, // Corrigido com 'as const'
      repeatType: "loop" as const, // Corrigido com 'as const'
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

          <S.StatsRow>{/* ... Seus StatItems ... */}</S.StatsRow>
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

          <S.DemoCredentials
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Info size={20} color="#FD7E14" />
            <div>
              <h4>Credenciais de Demonstração</h4>
              <p>
                Email: <strong>{DEFAULT_USER.email}</strong>
                <br />
                Senha: <strong>{DEFAULT_USER.password}</strong>
              </p>
            </div>
          </S.DemoCredentials>

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
              {" "}
              {/* Usamos o Styled aqui por causa do link "Esqueceu sua senha?" */}
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
                />
              </S.InputWrapper>
              <S.ForgotPassword
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Esqueceu sua senha?
              </S.ForgotPassword>
            </S.InputGroupStyled>

            {/* Exibe erro geral de login */}
            {error && (
              <S.ErrorMessage role="alert">
                <AlertCircle size={14} /> {error}
              </S.ErrorMessage>
            )}

            {/* Usando o Button genérico */}
            <S.SubmitButtonStyled
              type="submit"
              whileHover={!isLoading ? { scale: 1.02 } : undefined} // Desativa hover se loading
              whileTap={!isLoading ? { scale: 0.98 } : undefined} // Desativa tap se loading
              disabled={
                isLoading || !email || !password || password.length < 6
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
