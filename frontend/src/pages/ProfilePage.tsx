import React, { useState } from "react";
import { Lock } from "react-feather";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import FinPoints from "../components/gamification/FinPoints";
import Badge from "../components/gamification/Badge";
import ProgressBar from "../components/gamification/ProgressBar";
import { AvatarEditor } from "../components/profile/AvatarEditor";
import { EditableField } from "../components/profile/EditableField";
import { PasswordChangeModal } from "../components/profile/PasswordChangeModal";
import { calculateLevelProgress, getFinPointsForLevel } from "../utils/levelingSystem";
import * as S from "./ProfilePage.styles";

const badges = [
  { id: 1, level: "gold", icon: "🏆", label: "Mestre do Orçamento", status: "unlocked" },
  { id: 2, level: "silver", icon: "💸", label: "Poupadora", status: "unlocked" },
  { id: 3, level: "bronze", icon: "📊", label: "Analista", status: "unlocked" },
  { id: 4, level: "bronze", icon: "🎯", label: "Focada", status: "unlocked" },
  { id: 5, level: "bronze", icon: "📱", label: "App User", status: "unlocked" },
  { id: 6, level: "silver", icon: "🔄", label: "Consistente", status: "locked" },
  { id: 7, level: "gold", icon: "🚀", label: "Ambiciosa", status: "locked" },
  { id: 8, level: "bronze", icon: "📚", label: "Estudiosa", status: "locked" },
] as const;

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

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  const progressPercent = calculateLevelProgress(user.totalFinPoints);
  const finPointsForNextLevel = getFinPointsForLevel(user.level + 1);
  const tooltipMessage = `${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints`;

  const handleSaveAvatar = async (newAvatarUrl: string, file?: File) => {
    if (file) {
      console.log("Salvando arquivo de imagem:", file);
    } else {
      console.log("Salvando avatar URL:", newAvatarUrl);
    }
  };

  const handleSaveName = async (newName: string) => {
    console.log("Salvando nome:", newName);
  };

  const handleSaveEmail = async (newEmail: string) => {
    console.log("Salvando email:", newEmail);
  };

  return (
    <S.PageContainer>
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <S.ProfileHeader padding="large">
        <AvatarEditor
          currentAvatar={user.avatarUrl || ""}
          userName={user.name}
          userLevel={user.level}
          onSave={handleSaveAvatar}
        />
        
        <S.UserName>{user.name}</S.UserName>
        <S.UserTitle>Investidor(a) Iniciante</S.UserTitle>
        
        <S.StatsContainer>
          <FinPoints points={user.totalFinPoints} />
        </S.StatsContainer>

        {/* Barra de progresso XP */}
        <S.ProgressWrapper>
          <ProgressBar
            progress={progressPercent}
            variant="xp"
            height={8}
            tooltipText={tooltipMessage}
          />
        </S.ProgressWrapper>
      </S.ProfileHeader>

      <S.SettingsSection padding="medium">
        <S.SectionTitle>Informações Pessoais</S.SectionTitle>
        
        <EditableField
          label="Nome"
          value={user.name}
          onSave={handleSaveName}
          placeholder="Seu nome completo"
        />
        
        <EditableField
          label="Email"
          value={user.email || ""}
          onSave={handleSaveEmail}
          type="email"
          placeholder="seu@email.com"
        />
        
        <S.SettingItem>
          <S.SettingLabel>Senha</S.SettingLabel>
          <span style={{ color: "#666" }}>••••••••</span>
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsPasswordModalOpen(true)}
            style={{ 
              padding: "6px 12px", 
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Lock size={14} />
            Alterar
          </Button>
        </S.SettingItem>
      </S.SettingsSection>

      <div>
        <S.SectionTitle>Suas Conquistas</S.SectionTitle>
        <S.BadgesContainer>
          {badges.map((badge) => (
            <Badge
              key={badge.id}
              level={badge.level as "bronze" | "silver" | "gold"}
              icon={badge.icon}
              label={badge.label}
              status={badge.status as "locked" | "unlocked"}
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
        <S.SectionTitle>Estatísticas da Conta</S.SectionTitle>
        
        <S.SettingItem>
          <S.SettingLabel>Membro desde</S.SettingLabel>
          <span>Janeiro 2024</span>
        </S.SettingItem>
        
        <S.SettingItem>
          <S.SettingLabel>Total de FinPoints</S.SettingLabel>
          <span>{user.totalFinPoints.toLocaleString()}</span>
        </S.SettingItem>
        
        <S.SettingItem>
          <S.SettingLabel>Nível Atual</S.SettingLabel>
          <span>Nível {user.level}</span>
        </S.SettingItem>

        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
          <Button variant="outline" fullWidth onClick={logout}>
            Sair da Conta
          </Button>
        </div>
      </S.SettingsSection>
    </S.PageContainer>
  );
};

export default ProfilePage;