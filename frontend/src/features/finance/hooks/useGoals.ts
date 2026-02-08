import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import {
    getAllGoals,
    getGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
} from '../services/goals-api';
import type {
    CreateGoalDTO,
    UpdateGoalDTO,
    GoalUpdateResponseDTO,
} from '../services/goals-api';

/**
 * Finance Feature - Goals Hooks
 * 
 * TanStack Query hooks for goals management.
 */

// Query Keys
export const goalsKeys = {
    all: ['goals'] as const,
    lists: () => [...goalsKeys.all, 'list'] as const,
    list: (filters?: any) => [...goalsKeys.lists(), filters] as const,
    details: () => [...goalsKeys.all, 'detail'] as const,
    detail: (id: string) => [...goalsKeys.details(), id] as const,
};

/**
 * Hook to fetch all user goals
 */
export function useGoals() {
    return useQuery({
        queryKey: goalsKeys.lists(),
        queryFn: getAllGoals,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch a single goal by ID
 */
export function useGoal(goalId: string | undefined) {
    return useQuery({
        queryKey: goalsKeys.detail(goalId || ''),
        queryFn: () => getGoalById(goalId!),
        enabled: !!goalId,
        staleTime: 2 * 60 * 1000,
    });
}

/**
 * Hook to create a new goal
 */
export function useCreateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newGoal: CreateGoalDTO) => createGoal(newGoal),

        onSuccess: () => {
            // Invalidate goals list to refetch
            queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });

            toast.success('Meta criada com sucesso!');
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao criar meta';
            toast.error(message);
        },
    });
}

/**
 * Hook to update a goal
 */
export function useUpdateGoal() {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation({
        mutationFn: ({ goalId, updates }: { goalId: string; updates: UpdateGoalDTO }) =>
            updateGoal(goalId, updates),

        onSuccess: (data: GoalUpdateResponseDTO, variables) => {
            // Update goal in cache
            queryClient.setQueryData(
                goalsKeys.detail(variables.goalId),
                data.updatedGoal
            );

            // Invalidate goals list
            queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });

            // If mission was completed, update user stats
            if (data.missionCompletion) {
                const { totalFinPoints, level, didLevelUp, unlockedBadge } = data.missionCompletion;

                const userUpdate: any = {
                    totalFinPoints,
                    level,
                };

                // Map AchievementDTO to Achievement if present
                if (unlockedBadge) {
                    userUpdate.unlockedBadge = {
                        achievementId: typeof unlockedBadge.id === 'string'
                            ? parseInt(unlockedBadge.id)
                            : unlockedBadge.id,
                        title: unlockedBadge.title,
                        icon: unlockedBadge.icon,
                        unlockedDate: new Date().toISOString(),
                    };
                }

                updateUser(userUpdate);

                // Show special notifications
                if (didLevelUp) {
                    toast.success(`🎉 Parabéns! Você subiu para o nível ${level}!`, {
                        duration: 5000,
                    });
                }

                if (unlockedBadge) {
                    toast.success(`🏆 Conquista desbloqueada: ${unlockedBadge.title}!`, {
                        duration: 5000,
                    });
                }
            }

            toast.success('Meta atualizada com sucesso!');
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao atualizar meta';
            toast.error(message);
        },
    });
}

/**
 * Hook to delete a goal
 */
export function useDeleteGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (goalId: string) => deleteGoal(goalId),

        onSuccess: (_, deletedGoalId) => {
            // Remove goal from cache
            queryClient.removeQueries({ queryKey: goalsKeys.detail(deletedGoalId) });

            // Invalidate goals list
            queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });

            toast.success('Meta removida com sucesso!');
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao remover meta';
            toast.error(message);
        },
    });
}
