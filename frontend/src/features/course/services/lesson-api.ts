import api from '@/services/api';

/**
 * Course Feature - Lessons API Service
 */

export interface LessonDetailsDTO {
    id: string;
    title: string;
    courseId: string;
    lessonOrder: number;
    recFinPoints: number;
    nextLessonId: string | null;
    previousLessonId: string | null;
}

export interface QuizOption {
    letter: string;
    text: string;
}

export interface QuizQuestion {
    question: string;
    options: QuizOption[];
    correctAnswer: string;
    explanation: string;
}

export interface BadgeDTO {
    id: number | string;
    title: string;
    description: string;
    icon: string;
    requiredLevel: number;
}

export interface LessonCompletionDTO {
    awardedFinPoints: number;
    totalFinPoints: number;
    level: number;
    didLevelUp: boolean;
    courseProgress: number;
    unlockedBadge: BadgeDTO | null;
}

/**
 * Get lesson details
 */
export const getLessonDetails = async (lessonId: string): Promise<LessonDetailsDTO> => {
    const response = await api.get<LessonDetailsDTO>(`/lessons/${lessonId}`);
    return response.data;
};

/**
 * Get lesson quiz questions
 */
export const getLessonQuiz = async (lessonId: string): Promise<QuizQuestion[]> => {
    const response = await api.get<QuizQuestion[]>(`/lessons/${lessonId}/quiz`);
    return response.data;
};

/**
 * Mark lesson as completed
 */
export const completeLesson = async (lessonId: string): Promise<LessonCompletionDTO> => {
    const response = await api.post<LessonCompletionDTO>(`/lessons/${lessonId}/complete`);
    return response.data;
};
