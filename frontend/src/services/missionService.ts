import api from './api';

export const MissionCategory = {
  LEARNING: 'LEARNING',
  BUDGET: 'BUDGET',
  GOALS: 'GOALS',
  SOCIAL: 'SOCIAL',
} as const;

export type MissionCategory = typeof MissionCategory[keyof typeof MissionCategory];

export const MissionStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];

export interface MissionProgressDTO {
  id: string;
  title: string;
  description: string;
  rewardFinPoints: number;
  category: MissionCategory;
  targetCount: number;
  currentCount: number;
  status: MissionStatus;
  progressPercentage: number;
}

export const getMissionsForUser = async (): Promise<MissionProgressDTO[]> => {
  try {
    const response = await api.get('/missions');
    return response.data;
  } catch (error) {
    throw error;
  }
};