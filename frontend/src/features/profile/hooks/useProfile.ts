import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import {
    getUserProfile,
    updateUserAvatar,
    updateUserProfile,
    updateUserEmail,
} from '../services/profile-api';
import type { UpdateProfileDTO, UserProfileDTO } from '../types/profile.types';

/**
 * Profile Feature - TanStack Query Hooks
 * 
 * Custom hooks for profile data fetching and mutations.
 * Replaces manual useEffect + useState patterns.
 */

// Query Keys
export const profileKeys = {
    all: ['profile'] as const,
    detail: (userId: string) => [...profileKeys.all, userId] as const,
};

/**
 * Hook to fetch user profile
 * 
 * @param userId - User ID to fetch profile for
 * @returns Query result with profile data
 */
export function useUserProfile(userId: string | undefined) {
    return useQuery({
        queryKey: profileKeys.detail(userId || ''),
        queryFn: () => getUserProfile(userId!),
        enabled: !!userId, // Only run if userId is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch current authenticated user's profile
 * 
 * Uses the auth store to get the current user ID
 */
export function useCurrentUserProfile() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: profileKeys.detail(user?.uid || ''),
        queryFn: () => getUserProfile(user!.uid),
        enabled: !!user?.uid,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to update user avatar
 * 
 * Automatically updates cache and shows toast notifications
 */
export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation({
        mutationFn: (avatarUrl: string) => updateUserAvatar(avatarUrl),

        onSuccess: (updatedProfile: UserProfileDTO) => {
            // Update query cache
            if (user?.uid) {
                queryClient.setQueryData(
                    profileKeys.detail(user.uid),
                    updatedProfile
                );
            }

            // Update auth store
            updateUser({ avatarUrl: updatedProfile.avatarUrl });

            // Show success toast
            toast.success('Avatar atualizado com sucesso!');
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao atualizar avatar';
            toast.error(message);
        },
    });
}

/**
 * Hook to update user profile
 * 
 * Automatically updates cache and shows toast notifications
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation({
        mutationFn: (updates: UpdateProfileDTO) => updateUserProfile(updates),

        onSuccess: (updatedProfile: UserProfileDTO) => {
            // Update query cache
            if (user?.uid) {
                queryClient.setQueryData(
                    profileKeys.detail(user.uid),
                    updatedProfile
                );
            }

            // Update auth store
            updateUser({
                name: updatedProfile.name,
                avatarUrl: updatedProfile.avatarUrl,
            });

            // Show success toast
            toast.success('Perfil atualizado com sucesso!');
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao atualizar perfil';
            toast.error(message);
        },
    });
}

/**
 * Example usage:
 * 
 * ```tsx
 * function ProfilePage() {
 *   const { data: profile, isLoading, error } = useCurrentUserProfile();
 *   const updateAvatar = useUpdateAvatar();
 *   const updateProfile = useUpdateProfile();
 *   
 *   const handleAvatarChange = (url: string) => {
 *     updateAvatar.mutate(url);
 *   };
 *   
 *   const handleProfileUpdate = (data: UpdateProfileDTO) => {
 *     updateProfile.mutate(data);
 *   };
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *   
 *   return <ProfileView profile={profile} onUpdate={handleProfileUpdate} />;
 * }
 * ```
/**
 * Hook to update user email
 * 
 * Automatically updates auth store and handles logout on success
 */
export function useUpdateEmail() {
    return useMutation({
        mutationFn: (email: string) => updateUserEmail(email),
        // Success handling is done by the caller (needs to logout)
        // or we could do it here if we inject logout function
    });
}

/**
 * Example usage:
 * 
 * ```tsx
 * function ProfilePage() {
 *   const { data: profile, isLoading, error } = useCurrentUserProfile();
 *   const updateAvatar = useUpdateAvatar();
 *   const updateProfile = useUpdateProfile();
 *   
 *   const handleAvatarChange = (url: string) => {
 *     updateAvatar.mutate(url);
 *   };
 *   
 *   const handleProfileUpdate = (data: UpdateProfileDTO) => {
 *     updateProfile.mutate(data);
 *   };
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *   
 *   return <ProfileView profile={profile} onUpdate={handleProfileUpdate} />;
 * }
 * ```
 */
