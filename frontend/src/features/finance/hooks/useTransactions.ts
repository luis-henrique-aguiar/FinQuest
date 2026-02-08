/**
 * TanStack Query hooks for transactions and financial planning
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import {
    getAllTransactions,
    getFinancialOverview,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    monthKeyToRange,
    type Transaction,
    type FinancialOverview,
    type CreateTransactionDTO,
    type UpdateTransactionDTO,
    type CreateTransactionResponse,
} from '../services/transaction-api';

/**
 * Query Keys for transactions
 */
export const transactionsKeys = {
    all: ['transactions'] as const,
    lists: () => [...transactionsKeys.all, 'list'] as const,
    list: (monthKey: string) => [...transactionsKeys.lists(), monthKey] as const,
    overview: (monthKey: string) => [...transactionsKeys.all, 'overview', monthKey] as const,
};

/**
 * Hook to fetch transactions for a specific month
 */
export function useTransactions(monthKey: string) {
    const { startDate, endDate } = monthKeyToRange(monthKey);

    return useQuery<Transaction[]>({
        queryKey: transactionsKeys.list(monthKey),
        queryFn: () => getAllTransactions(startDate, endDate),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch financial overview for a specific month
 */
export function useFinancialOverview(monthKey: string) {
    const { startDate, endDate } = monthKeyToRange(monthKey);

    return useQuery<FinancialOverview>({
        queryKey: transactionsKeys.overview(monthKey),
        queryFn: () => getFinancialOverview(startDate, endDate),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to create a transaction
 */
export function useCreateTransaction(monthKey: string) {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation<CreateTransactionResponse, Error, CreateTransactionDTO>({
        mutationFn: createTransaction,

        onSuccess: (data) => {
            // Invalidate both transactions and overview
            queryClient.invalidateQueries({ queryKey: transactionsKeys.list(monthKey) });
            queryClient.invalidateQueries({ queryKey: transactionsKeys.overview(monthKey) });

            // Handle gamification rewards
            if (data.missionCompletion) {
                const { missionCompletion } = data;

                updateUser({
                    totalFinPoints: missionCompletion.totalFinPoints,
                    level: missionCompletion.level,
                });

                if (missionCompletion.didLevelUp && missionCompletion.unlockedBadge) {
                    toast.success('🎉 Nova conquista desbloqueada!', {
                        description: `${missionCompletion.unlockedBadge.name} - Nível ${missionCompletion.level}`,
                    });
                } else if (missionCompletion.didLevelUp) {
                    toast.success(`🎊 Parabéns! Você subiu para o nível ${missionCompletion.level}!`);
                }
            }

            const message =
                data.transaction.type === 'INCOME'
                    ? 'Receita adicionada com sucesso!'
                    : 'Despesa adicionada com sucesso!';
            toast.success(message);
        },

        onError: () => {
            toast.error('Erro ao criar transação. Tente novamente.');
        },
    });
}

/**
 * Hook to update a transaction
 */
export function useUpdateTransaction(monthKey: string) {
    const queryClient = useQueryClient();

    return useMutation<Transaction, Error, { id: string; data: UpdateTransactionDTO }>({
        mutationFn: ({ id, data }) => updateTransaction(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionsKeys.list(monthKey) });
            queryClient.invalidateQueries({ queryKey: transactionsKeys.overview(monthKey) });

            toast.success('Transação atualizada com sucesso!');
        },

        onError: (error: any) => {
            const message = error?.response?.data?.details?.[0] ||
                'Erro ao atualizar transação. Por favor, tente novamente.';
            toast.error(message);
        },
    });
}

/**
 * Hook to delete a transaction
 */
export function useDeleteTransaction(monthKey: string) {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteTransaction,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionsKeys.list(monthKey) });
            queryClient.invalidateQueries({ queryKey: transactionsKeys.overview(monthKey) });

            toast.success('Transação excluída com sucesso!');
        },

        onError: () => {
            toast.error('Erro ao excluir transação. Tente novamente.');
        },
    });
}
