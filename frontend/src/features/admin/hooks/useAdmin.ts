import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getAdminStats,
    getAllUsers,
    promoteUserToAdmin,
    type AdminStats,
    type PageResponse,
    type UserSummary,
} from '../services/admin-api';

export const adminKeys = {
    all: ['admin'] as const,
    stats: () => [...adminKeys.all, 'stats'] as const,
    users: (page: number, size: number, sort: string) =>
        [...adminKeys.all, 'users', page, size, sort] as const,
};

export function useAdminStats() {
    return useQuery<AdminStats>({
        queryKey: adminKeys.stats(),
        queryFn: getAdminStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useAdminUsers(page: number = 0, size: number = 20, sort: string = 'name,asc') {
    return useQuery<PageResponse<UserSummary>>({
        queryKey: adminKeys.users(page, size, sort),
        queryFn: () => getAllUsers(page, size, sort),
        staleTime: 1000 * 60 * 1, // 1 minute
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
}

export function usePromoteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: promoteUserToAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.all });
            toast.success('Usuário promovido a Admin com sucesso!');
        },
        onError: (error) => {
            console.error('Erro ao promover usuário:', error);
            toast.error('Erro ao promover usuário. Tente novamente.');
        },
    });
}
