import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
    useCurrentUserProfile,
    useUpdateAvatar,
    useUpdateProfile,
    useUpdateEmail,
} from '@/features/profile/hooks/useProfile';
import {
    calculateLevelProgress,
    getFinPointsForLevel,
} from '@/utils/levelingSystem';
import { deleteImageByUrl, uploadProfileImageWithCompression } from '@/services/storageService';

export const useProfileLogic = () => {
    const { user, logout } = useAuth();
    const { isLoading, error } = useCurrentUserProfile();
    const updateAvatarMutation = useUpdateAvatar();
    const updateProfileMutation = useUpdateProfile();
    const updateEmailMutation = useUpdateEmail();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const allAchievements = user?.unlockedAchievements || [];
    const recentAchievements = [...allAchievements].reverse().slice(0, 3);
    const hasAchievements = allAchievements.length > 0;

    const progressPercent = user ? calculateLevelProgress(user.totalFinPoints) : 0;
    const finPointsForNextLevel = user ? getFinPointsForLevel(user.level + 1) : 100;
    const tooltipMessage = user ? `${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints` : '';

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

    const handleSaveAvatar = async (newAvatarUrl: string, file?: File) => {
        if (!user) return;
        try {
            let finalAvatarUrl = newAvatarUrl;

            if (file) {
                finalAvatarUrl = await uploadProfileImageWithCompression(
                    user.uid,
                    file,
                    user.avatarUrl || undefined
                );
            } else if (user.avatarUrl && user.avatarUrl.includes('firebasestorage')) {
                await deleteImageByUrl(user.avatarUrl);
            }

            updateAvatarMutation.mutate(finalAvatarUrl);
        } catch (error: any) {
            if (error.message?.includes('5MB')) {
                toast.error('A imagem deve ter no máximo 5MB');
            } else {
                toast.error('Erro ao atualizar foto de perfil. Tente novamente.');
            }
            throw error;
        }
    };

    const handleSaveName = async (newName: string) => {
        if (!user) return;
        const nameTrimmed = newName.trim();
        if (nameTrimmed === user.name) return;

        try {
            await updateProfileMutation.mutateAsync({ name: nameTrimmed });
        } catch (error) {
            throw error;
        }
    };

    const handleSaveEmail = async (newEmail: string) => {
        if (!user) return;
        const emailTrimmed = newEmail.trim();
        if (emailTrimmed === user.email) return;

        try {
            await updateEmailMutation.mutateAsync(emailTrimmed);
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

    return {
        user,
        isLoading,
        error,
        isPasswordModalOpen,
        setIsPasswordModalOpen,
        recentAchievements,
        hasAchievements,
        progressPercent,
        tooltipMessage,
        logout,
        formatRegistrationDate,
        handleSaveAvatar,
        handleSaveName,
        handleSaveEmail,
    };
};
