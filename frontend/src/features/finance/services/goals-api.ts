import api from '@/services/api';

/**
 * Finance Feature - Goals API Service
 * 
 * Handles all HTTP requests related to financial goals.
 */

export interface GoalDTO {
    id: string;
    name: string;
    statusLabel: 'IN_PROGRESS' | 'COMPLETED';
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

export interface CreateGoalDTO {
    name: string;
    targetAmount: number;
    currentAmount?: number;
}

export interface UpdateGoalDTO {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
}

/**
 * Get all user goals
 */
export const getAllGoals = async (): Promise<GoalDTO[]> => {
    const response = await api.get<GoalDTO[]>('/goals');
    return response.data;
};

/**
 * Get goal by ID
 */
export const getGoalById = async (goalId: string): Promise<GoalDTO> => {
    const response = await api.get<GoalDTO>(`/goals/${goalId}`);
    return response.data;
};

/**
 * Create new goal
 */
export const createGoal = async (goal: CreateGoalDTO): Promise<GoalDTO> => {
    const response = await api.post<GoalDTO>('/goals', goal);
    return response.data;
};

/**
 * Update existing goal
 */
export const updateGoal = async (
    goalId: string,
    updates: UpdateGoalDTO
): Promise<GoalUpdateResponseDTO> => {
    const response = await api.patch<GoalUpdateResponseDTO>(`/goals/${goalId}`, updates);
    return response.data;
};

/**
 * Delete goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
    await api.delete(`/goals/${goalId}`);
};
