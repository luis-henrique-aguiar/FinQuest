import { useState } from 'react';
import {
    useAdminStats,
    useAdminUsers,
    usePromoteUser,
} from '@/features/admin/hooks/useAdmin';

export const useAdminDashboard = () => {
    const [currentPage, setCurrentPage] = useState(0);

    // TanStack Query hooks
    const { data: stats, isLoading: isLoadingStats, error: statsError } = useAdminStats();
    const { data: users, isLoading: isLoadingUsers, error: usersError } = useAdminUsers(currentPage);
    const promoteUserMutation = usePromoteUser();

    const handlePromoteUser = (userId: string, userName: string) => {
        if (
            !window.confirm(`Tem certeza que deseja promover ${userName} a Admin?`)
        ) {
            return;
        }

        promoteUserMutation.mutate(userId);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Nunca";
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    return {
        currentPage,
        stats,
        users,
        isLoadingStats,
        isLoadingUsers,
        statsError,
        usersError,
        promoteUserMutation,
        handlePromoteUser,
        handlePageChange,
        formatDate,
    };
};
