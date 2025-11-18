import api from "./api";

export interface GoalDTO {
  id: string;
  name: string;
  statusLabel: string;
  currentAmount: number;
  targetAmount: number;
  completionPercentage: string;
  remainingAmount: number;
}

export interface AchievementDTO {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredLevel: number;
}

export interface GoalCompletionDTO {
  totalFinPoints: number;
  level: number;
  didLevelUp: boolean;
  unlockedBadge: AchievementDTO | null;
}

export interface GoalUpdateResponseDTO {
  updatedGoal: GoalDTO;
  missionCompletion: GoalCompletionDTO | null;
}

export const getAllGoals = async (): Promise<GoalDTO[]> => {
  try {
    const response = await api.get('/goals');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar missões:', error);
    throw error;
  }
};