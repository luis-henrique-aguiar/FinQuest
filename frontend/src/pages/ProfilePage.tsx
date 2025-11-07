import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import FinPoints from "../components/gamification/FinPoints";
// import Streak from "../components/gamification/Streak";
// import Badge from "../components/gamification/Badge";
// import { EditProfileModal } from "../components/gamification/EditProfileModal";
import * as S from "./ProfilePage.styles";

// Mock data para badges - em uma aplicação real, isso viria de uma API
const badges = [
  { id: 1, level: "gold", icon: "🏆", label: "Mestre do Orçamento" },
  { id: 2, level: "silver", icon: "💸", label: "Poupadora" },
  { id: 3, level: "bronze", icon: "📊", label: "Analista" },
  { id: 4, level: "bronze", icon: "🎯", label: "Focada" },
  { id: 5, level: "bronze", icon: "📱", label: "App User" },
  { id: 6, level: "silver", icon: "🔄", label: "Consistente" },
  { id: 7, level: "gold", icon: "🚀", label: "Ambiciosa" },
  { id: 8, level: "bronze", icon: "📚", label: "Estudiosa" },
] as const;

// Mock data para conquistas
const achievements = [
  {
    id: 1,
    title: "Primeira Semana Completa",
    description: "Manteve uma ofensiva de 7 dias consecutivos",
    icon: "🔥",
  },
  {
    id: 2,
    title: "Orçamento Mestre",
    description: "Criou seu primeiro orçamento mensal completo",
    icon: "📊",
  },
  {
    id: 3,
    title: "Economizadora Iniciante",
    description: "Economizou R$100 em sua primeira meta",
    icon: "💰",
  },
];

// Componente temporário para Streak até ser implementado
const StreakPlaceholder: React.FC<{ days: number }> = ({ days }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '24px' }}>🔥</div>
    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{days}</div>
    <div style={{ fontSize: '12px', color: '#666' }}>dias</div>
  </div>
);

// Componente temporário para Badge até ser implementado
const BadgePlaceholder: React.FC<{
  level: string;
  icon: string;
  label: string;
  onClick?: () => void;
}> = ({ level, icon, label, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: level === 'gold' ? '#FFD700' : level === 'silver' ? '#C0C0C0' : '#CD7F32',
      cursor: 'pointer',
      minHeight: '80px',
      justifyContent: 'center',
    }}
  >
    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
    <div style={{ fontSize: '10px', textAlign: 'center', color: '#333' }}>{label}</div>
  </div>
);

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <S.PageContainer>
      {/* Modal de edição - será implementado depois */}
      {/* <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      /> */}

      <S.ProfileHeader padding="large">
        <S.AvatarContainer>
          <S.AvatarImage
            src={user.avatarUrl || "https://i.pravatar.cc/300"}
            alt="User avatar"
          />
          <S.LevelBadge>Nv. {user.level}</S.LevelBadge>
        </S.AvatarContainer>
        
        <S.UserName>{user.name}</S.UserName>
        <S.UserTitle>Investidor(a) Iniciante</S.UserTitle>
        
        <S.StatsContainer>
          <FinPoints points={user.totalFinPoints} />
          <StreakPlaceholder days={7} />
        </S.StatsContainer>
        
        <Button
          variant="outline"
          fullWidth
          onClick={() => setIsEditModalOpen(true)}
        >
          Editar Perfil
        </Button>
      </S.ProfileHeader>

      <div>
        <S.SectionTitle>Suas Conquistas</S.SectionTitle>
        <S.BadgesContainer>
          {badges.map((badge) => (
            <BadgePlaceholder
              key={badge.id}
              level={badge.level}
              icon={badge.icon}
              label={badge.label}
              onClick={() => console.log(`Badge ${badge.id} clicked`)}
            />
          ))}
        </S.BadgesContainer>
      </div>

      <S.AchievementsSection padding="medium">
        <S.SectionTitle>Conquistas Recentes</S.SectionTitle>
        <S.AchievementsList>
          {achievements.map((achievement) => (
            <S.Achievement key={achievement.id}>
              <S.AchievementIcon>{achievement.icon}</S.AchievementIcon>
              <S.AchievementInfo>
                <S.AchievementTitle>{achievement.title}</S.AchievementTitle>
                <S.AchievementDescription>
                  {achievement.description}
                </S.AchievementDescription>
              </S.AchievementInfo>
            </S.Achievement>
          ))}
        </S.AchievementsList>
      </S.AchievementsSection>

      <S.SettingsSection padding="medium">
        <S.SectionTitle>Configurações</S.SectionTitle>
        <Button variant="outline" fullWidth onClick={logout}>
          Sair da Conta
        </Button>
      </S.SettingsSection>
    </S.PageContainer>
  );
};

export default ProfilePage;