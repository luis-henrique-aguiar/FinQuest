/**
 * TanStack Query hooks for missions
 */
import { useQuery } from '@tanstack/react-query';
import type { MissionProgressDTO } from '../services/missions-api';
import { getMissionsForUser } from '../services/missions-api';

/**
 * Query Keys for missions
 */
export const missionsKeys = {
    all: ['missions'] as const,
    lists: () => [...missionsKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
        [...missionsKeys.lists(), filters] as const,
};

/**
 * Hook to fetch all missions for the current user
 */
export function useMissions() {
    return useQuery<MissionProgressDTO[]>({
        queryKey: missionsKeys.lists(),
        queryFn: getMissionsForUser,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
