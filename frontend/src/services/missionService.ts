import api from './api';

export interface MissionProgressDTO {
  id: string;
  title: string;
  description: string;
  rewardFinPoints: number;
  category: 'LEARNING' | 'BUDGET' | 'GOALS' | 'SOCIAL';
  targetCount: number;
  currentCount: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
}

export const getMissions = async (): Promise<MissionProgressDTO[]> => {
  try {
    const response = await api.get('/missions');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar missões:", error);
    throw error;
  }
};