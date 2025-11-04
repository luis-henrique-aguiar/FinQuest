import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import MissionCard from "../components/gamification/MissionCard";
import { DailyGoalItem } from "../components/home/DailyGoalItem";
import * as S from "./HomePage.styles";
import greetingAnimation from "../assets/animations/hi_girl.json";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.name ? user.name.split(" ")[0] : "Viajante";
  const isProfileComplete = !user?.avatarUrl || !user.name;

  const dailyGoals = [
    { id: 1, title: "Completar missão diária", progress: 0, total: 1 },
    { id: 2, title: "Registrar despesas do dia", progress: 3, total: 5 },
  ];

  const recommendedMissions = [
    {
      id: 1,
      title: "Fundamentos do Orçamento",
      description: "Aprenda a criar e manter um orçamento pessoal eficaz",
      icon: "📊",
      progress: 0,
      reward: { finPoints: 50, coins: 25 },
      timeEstimate: "5 min",
    },
    {
      id: 2,
      title: "Emergências Financeiras",
      description: "Como criar um fundo de emergência que realmente funciona",
      icon: "🚨",
      progress: 30,
      reward: { finPoints: 75 },
      timeEstimate: "8 min",
    },
  ];

  return (
    <S.PageContainer>
      {/* Notificação para completar o perfil (Lógica adicionada) */}
      {isProfileComplete && (
        <S.NotificationCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/perfil")}
        >
          <h4>Complete seu Perfil!</h4>
          <p>
            Adicione um avatar e outras informações para personalizar sua
            jornada.
          </p>
        </S.NotificationCard>
      )}

      {/* Seção de Boas-Vindas */}
      <S.WelcomeSection padding="large">
        <S.WelcomeHeader>
          <S.WelcomeText>
            <h1>Olá, {userName}! 👋</h1>
            <p>Vamos continuar sua jornada financeira hoje?</p>
          </S.WelcomeText>
          <Lottie
            animationData={greetingAnimation}
            loop={true}
            style={{ width: 150, height: 150, marginTop: "-20px" }}
          />
        </S.WelcomeHeader>
        <Button onClick={() => navigate("/learn")}>Continuar Aprendendo</Button>
      </S.WelcomeSection>

      {/* Seção de Metas Diárias */}
      <S.DailyGoalsSection>
        <S.SectionTitle>Metas Diárias</S.SectionTitle>
        {dailyGoals.map((goal) => (
          <DailyGoalItem
            key={goal.id}
            title={goal.title}
            progress={goal.progress}
            total={goal.total}
          />
        ))}
      </S.DailyGoalsSection>

      {/* Seção de Missões */}
      <S.MissionsSection>
        <S.SectionHeader>
          <S.SectionTitle>Missões Recomendadas</S.SectionTitle>
          <S.ViewAllLink onClick={() => navigate("/missions")}>
            Ver todas
          </S.ViewAllLink>
        </S.SectionHeader>

        {recommendedMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            {...mission}
            onClick={() => navigate(`/learn/${mission.id}`)}
          />
        ))}
      </S.MissionsSection>
    </S.PageContainer>
  );
};

export default HomePage;
