import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
    MissionCategory,
    MissionStatus,
} from '@/features/gamification/services/missions-api';
import { useMissions } from '@/features/gamification/hooks/useMissions';

export type FilterType = 'ALL' | MissionStatus | MissionCategory;

export const useMissionsLogic = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

    // TanStack Query hook
    const { data: missions = [], isLoading, error } = useMissions();

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error('Erro ao carregar missões. Tente novamente.');
        }
    }, [error]);

    // Filter missions
    const filteredMissions = useMemo(() => {
        return missions.filter((mission) => {
            if (activeFilter === 'ALL') return true;

            // Filter by status
            if (
                activeFilter === MissionStatus.COMPLETED ||
                activeFilter === MissionStatus.IN_PROGRESS ||
                activeFilter === MissionStatus.NOT_STARTED
            ) {
                return mission.status === activeFilter;
            }

            // Filter by category
            return mission.category === activeFilter;
        });
    }, [missions, activeFilter]);

    // Statistics
    const stats = useMemo(() => {
        return {
            total: missions.length,
            completed: missions.filter((m) => m.status === MissionStatus.COMPLETED).length,
            inProgress: missions.filter((m) => m.status === MissionStatus.IN_PROGRESS).length,
        };
    }, [missions]);

    return {
        missions,
        isLoading,
        activeFilter,
        setActiveFilter,
        filteredMissions,
        stats,
    };
};
