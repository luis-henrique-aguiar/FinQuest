import api from "@/services/api";

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

export interface UpdateGoalDTO {
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export const getAllGoals = async (): Promise<GoalDTO[]> => {
    const response = await api.get<GoalDTO[]>('/goals');
    return response.data;
};

export const createGoal = async (data: UpdateGoalDTO): Promise<GoalDTO> => {
    const response = await api.post<GoalDTO>('/goals', data);
    return response.data;
};

export const updateGoal = async (id: string, data: UpdateGoalDTO): Promise<GoalUpdateResponseDTO> => {
    const response = await api.put<GoalUpdateResponseDTO>(`/goals/${id}`, data);
    return response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
};
