import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight, Check } from "react-feather";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import * as S from "./RegisterPage.styles";
import { BenefitItem } from "../components/auth/BenefitItem";
import { InputGroup } from "../components/auth/InputGroup";
import mascotWaveAnimation from "../assets/animations/fox_greetings.json";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    // Regex para verificar minúsculas E maiúsculas
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    // Regex para verificar números
    if (/[0-9]/.test(pass)) strength++;
    // Regex para verificar símbolos
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    // Limita a força a 4 para a barra de progresso visual
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
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
        return "Senha forte!";
      default:
        return "";
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 2) {
      // TODO: Usar Toast para feedback de erro
      alert(
        "⚠️ Por favor, escolha uma senha mais forte para proteger sua conta!"
      );
      return;
    }
    // TODO: Implementar chamada real de registro (AuthContext/Firebase/API)
    console.log("Registrando:", { name, email, password });
    alert(`🎉 Bem-vindo ao FinQuest, ${name}! Conta criada (simulação).`);
    // navigate('/home'); // Navegar após registro bem-sucedido
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
          <S.FormElement onSubmit={handleRegister}>
            {/* Usando o componente InputGroup */}
            <InputGroup
              id="name"
              label="Nome Completo"
              icon={<User size={20} />}
              type="text"
              placeholder="Como você quer ser chamado?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <InputGroup
              id="email"
              label="Email"
              icon={<Mail size={20} />}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Input de Senha com Indicador (mantido aqui pela lógica específica) */}
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
                  aria-describedby="password-hint" // Para acessibilidade
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

            <S.TermsText>
              Ao criar conta, você concorda com nossos{" "}
              <button type="button" onClick={() => alert("Mostrar Termos")}>
                Termos
              </button>{" "}
              e{" "}
              <button
                type="button"
                onClick={() => alert("Mostrar Privacidade")}
              >
                Privacidade
              </button>
              .
            </S.TermsText>

            {/* Usando o Button genérico */}
            <S.SubmitButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!name || !email || !password || passwordStrength < 2}
            >
              Criar Minha Conta
              <ArrowRight size={20} />
            </S.SubmitButton>
          </S.FormElement>

          <S.Divider>ou</S.Divider>

          <S.LoginPrompt>
            Já tem uma conta?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              {" "}
              {/* Navega para Login */}
              Faça login
            </button>
          </S.LoginPrompt>
        </S.FormContainer>
      </S.FormSide>
    </S.PageContainer>
  );
};

export default RegisterPage;
