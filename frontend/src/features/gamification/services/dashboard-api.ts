import api from '@/services/api';
import { type MissionProgressDTO } from '@/features/gamification/services/missions-api';
import { type CourseProgressDTO } from '@/features/course/services/course-api';

export interface DashboardDataDTO {
    missions: MissionProgressDTO[];
    courses: CourseProgressDTO[];
}

export const getDashboardData = async (): Promise<DashboardDataDTO> => {
    try {
        const [missionsResponse, coursesResponse] = await Promise.all([
            api.get('/missions'),
            api.get('/courses'),
        ]);

        return {
            missions: missionsResponse.data,
            courses: coursesResponse.data,
        };
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        throw error;
    }
};
