import api from './api';
import { type MissionProgressDTO } from './missionService';
import { type CourseProgressDTO } from './courseService';

export interface HomeDataDTO {
  missions: MissionProgressDTO[];
  courses: CourseProgressDTO[];
}

export const getHomeData = async (): Promise<HomeDataDTO> => {
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
    console.error('Erro ao buscar dados da home:', error);
    throw error;
  }
};