import React, { useState } from "react";
import { Lock } from "react-feather";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import api from "../services/api";
import Button from "../components/common/Button";
import FinPoints from "../components/gamification/FinPoints";
import ProgressBar from "../components/gamification/ProgressBar";
import { AvatarEditor } from "../components/profile/AvatarEditor";
import { EditableField } from "../components/profile/EditableField";
import { PasswordChangeModal } from "../components/profile/PasswordChangeModal";
import {
  calculateLevelProgress,
  getFinPointsForLevel,
} from "../utils/levelingSystem";
import * as S from "./ProfilePage.styles";
import { uploadProfileImageWithCompression } from "../services/storageService";
import { updateUserAvatar } from "../services/userService";

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUserContext } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { addToast } = useToast();

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  const allAchievements = user.unlockedAchievements || [];
  const recentAchievements = allAchievements.slice(-3).reverse();
  const hasAchievements = allAchievements.length > 0;

  const progressPercent = calculateLevelProgress(user.totalFinPoints);
  const finPointsForNextLevel = getFinPointsForLevel(user.level + 1);
  const tooltipMessage = `${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints`;

  const formatRegistrationDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Erro ao formatar data de registro:", error);
      return "N/A";
    }
  };

  const handleSaveAvatar = async (newAvatarUrl: string, file?: File) => {
    try {
      let finalAvatarUrl = newAvatarUrl;

      if (file) {
        finalAvatarUrl = await uploadProfileImageWithCompression(
          user.uid,
          file
        );
      }

      const updatedUser = await updateUserAvatar(finalAvatarUrl);

      updateUserContext({ avatarUrl: updatedUser.avatarUrl || undefined });
    } catch (error: any) {
      console.error("Erro ao salvar avatar:", error);

      if (error.message?.includes("5MB")) {
        addToast("A imagem deve ter no máximo 5MB", "error");
      } else {
        addToast("Erro ao atualizar foto de perfil. Tente novamente.", "error");
      }

      throw error;
    }
  };

  const handleSaveName = async (newName: string) => {
    const nameTrimmed = newName.trim();
    if (nameTrimmed === user!.name) return;

    try {
      await api.put("/users/name", {
        name: nameTrimmed,
      });

      updateUserContext({ name: nameTrimmed });
      addToast("Nome atualizado com sucesso!", "success");
    } catch (error: any) {
      if (error?.response?.data?.details) {
        addToast(`${error.response.data.details[0]}`, "error");
      } else {
        console.log(error);
        addToast("Erro ao atualizar nome. Tente novamente.", "error");
      }
    }
  };

  const handleSaveEmail = async (newEmail: string) => {
    const emailTrimmed = newEmail.trim();
    if (emailTrimmed === user!.email) return;

    try {
      await api.put("/users/email", {
        email: emailTrimmed,
      });

      await logout();
      addToast(
        "E-mail atualizado com sucesso! Por segurança, você foi desconectado e deve fazer login novamente com seu novo e-mail.",
        "success"
      );
    } catch (error: any) {
      console.error("Erro no updateEmail:", error);

      let errorMessage = "Erro ao atualizar email. Tente novamente.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.details) {
        errorMessage = error.response.data.details[0];
      }

      addToast(errorMessage, "error");
    }
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
              gap: "4px",
            }}
          >
            <Lock size={14} />
            Alterar
          </Button>
        </S.SettingItem>
      </S.SettingsSection>

      <S.AchievementsSection padding="medium">
        <S.SectionTitle>Conquistas Recentes</S.SectionTitle>

        {hasAchievements ? (
          <S.AchievementsList>
            {recentAchievements.map((achievement) => (
              <S.Achievement key={achievement.achievementId}>
                <S.AchievementIcon>{achievement.icon}</S.AchievementIcon>
                <S.AchievementInfo>
                  <S.AchievementTitle>{achievement.title}</S.AchievementTitle>
                  <S.AchievementDescription>
                    {new Date(achievement.unlockedDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </S.AchievementDescription>
                </S.AchievementInfo>
              </S.Achievement>
            ))}
          </S.AchievementsList>
        ) : (
          <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
            Nenhuma conquista desbloqueada ainda. Continue usando o FinQuest
            para ganhar sua primeira!
          </div>
        )}
      </S.AchievementsSection>

      <S.SettingsSection padding="medium">
        <S.SectionTitle>Estatísticas da Conta</S.SectionTitle>

        <S.SettingItem>
          <S.SettingLabel>Membro desde</S.SettingLabel>
          <span>{formatRegistrationDate(user.registrationAt)}</span>
        </S.SettingItem>

        <S.SettingItem>
          <S.SettingLabel>Total de FinPoints</S.SettingLabel>
          <span>{user.totalFinPoints.toLocaleString()}</span>
        </S.SettingItem>

        <S.SettingItem>
          <S.SettingLabel>Nível Atual</S.SettingLabel>
          <span>Nível {user.level}</span>
        </S.SettingItem>

        <div style={{ marginTop: "1rem", paddingTop: "1rem" }}>
          <Button variant="outline" fullWidth onClick={logout}>
            Sair da Conta
          </Button>
        </div>
      </S.SettingsSection>
    </S.PageContainer>
  );
};

export default ProfilePage;
