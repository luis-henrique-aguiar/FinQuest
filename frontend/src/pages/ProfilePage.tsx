import React, { useState } from 'react';
import { Lock, Award } from 'react-feather';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import {
  useCurrentUserProfile,
  useUpdateAvatar,
  useUpdateProfile,
  useUpdateEmail,
} from '@/features/profile/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FinPoints from '../components/gamification/FinPoints';
import ProgressBar from '../components/gamification/ProgressBar';
import { AvatarEditor } from '../components/profile/AvatarEditor';
import { EditableField } from '../components/profile/EditableField';
import { PasswordChangeModal } from '../components/profile/PasswordChangeModal';
import {
  calculateLevelProgress,
  getFinPointsForLevel,
} from '../utils/levelingSystem';
import { deleteImageByUrl, uploadProfileImageWithCompression } from '../services/storageService';

/**
 * ProfilePage - Refactored with TanStack Query & Tailwind CSS
 */
export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isLoading, error } = useCurrentUserProfile();
  const updateAvatar = useUpdateAvatar();
  const updateProfile = useUpdateProfile();
  const updateEmail = useUpdateEmail();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Show loading state
  if (isLoading || !user) {
    return <div className="p-8 text-center">Carregando perfil...</div>;
  }

  // Show error state
  if (error) {
    toast.error('Erro ao carregar perfil');
    return <div className="p-8 text-center text-red-500">Erro ao carregar perfil. Tente novamente.</div>;
  }

  const allAchievements = user.unlockedAchievements || [];
  const recentAchievements = allAchievements.slice(-3).reverse();
  const hasAchievements = allAchievements.length > 0;

  const progressPercent = calculateLevelProgress(user.totalFinPoints);
  const finPointsForNextLevel = getFinPointsForLevel(user.level + 1);
  const tooltipMessage = `${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints`;

  const formatRegistrationDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  /**
   * Handle avatar save
   */
  const handleSaveAvatar = async (newAvatarUrl: string, file?: File) => {
    try {
      let finalAvatarUrl = newAvatarUrl;

      // Upload to Firebase Storage if file provided
      if (file) {
        finalAvatarUrl = await uploadProfileImageWithCompression(
          user.uid,
          file,
          user.avatarUrl || undefined
        );
      }
      // Delete old Firebase image if switching to external URL
      else if (user.avatarUrl && user.avatarUrl.includes('firebasestorage')) {
        await deleteImageByUrl(user.avatarUrl);
      }

      // Use TanStack Query mutation
      updateAvatar.mutate(finalAvatarUrl);
    } catch (error: any) {
      if (error.message?.includes('5MB')) {
        toast.error('A imagem deve ter no máximo 5MB');
      } else {
        toast.error('Erro ao atualizar foto de perfil. Tente novamente.');
      }
      throw error;
    }
  };

  /**
   * Handle name update
   */
  const handleSaveName = async (newName: string) => {
    const nameTrimmed = newName.trim();
    if (nameTrimmed === user!.name) return;

    try {
      await updateProfile.mutateAsync({ name: nameTrimmed });
    } catch (error) {
      throw error;
    }
  };

  /**
   * Handle email update
   */
  const handleSaveEmail = async (newEmail: string) => {
    const emailTrimmed = newEmail.trim();
    if (emailTrimmed === user!.email) return;

    try {
      await updateEmail.mutateAsync(emailTrimmed);
      await logout();
      toast.success(
        'E-mail atualizado com sucesso! Por segurança, você foi desconectado e deve fazer login novamente com seu novo e-mail.'
      );
    } catch (error: any) {
      let errorMessage = 'Erro ao atualizar email. Tente novamente.';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.details) {
        errorMessage = error.response.data.details[0];
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Header Card */}
      <Card className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border-none shadow-sm">
        <div className="mb-4">
          <AvatarEditor
            currentAvatar={user.avatarUrl || ''}
            userName={user.name}
            userLevel={user.level}
            onSave={handleSaveAvatar}
          />
        </div>

        <h2 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-zinc-100">{user.name}</h2>
        <p className="text-zinc-500 mb-6 text-base">Investidor(a) Iniciante</p>

        <div className="flex justify-center w-full mb-6">
          <FinPoints points={user.totalFinPoints} />
        </div>

        {/* XP Progress Bar */}
        <div className="w-full max-w-md mb-2">
          <ProgressBar
            progress={progressPercent}
            variant="xp"
            height={8}
            tooltipText={tooltipMessage}
          />
        </div>
      </Card>

      {/* Personal Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <EditableField
            label="Nome"
            value={user.name}
            onSave={handleSaveName}
            placeholder="Seu nome completo"
          />

          <EditableField
            label="Email"
            value={user.email || ''}
            onSave={handleSaveEmail}
            type="email"
            placeholder="seu@email.com"
          />

          <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Senha</span>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 font-mono tracking-widest">••••••••</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 h-8"
              >
                <Lock size={14} />
                Alterar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Conquistas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {hasAchievements ? (
            <div className="flex flex-col gap-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.achievementId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl text-primary">
                    {achievement.icon || <Award size={24} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-0.5">{achievement.title}</h3>
                    <p className="text-sm text-zinc-500 m-0">
                      {new Date(achievement.unlockedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500">
              Nenhuma conquista desbloqueada ainda. Continue usando o FinQuest para ganhar sua primeira!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Estatísticas da Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Membro desde</span>
            <span className="text-zinc-600 dark:text-zinc-400">{formatRegistrationDate(user.registrationAt)}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Total de FinPoints</span>
            <span className="text-zinc-600 dark:text-zinc-400 font-mono">{user.totalFinPoints.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Nível Atual</span>
            <span className="text-zinc-600 dark:text-zinc-400">Nível {user.level}</span>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200" onClick={logout}>
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
