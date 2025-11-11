import api from "./api";

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

export interface LessonCompletionDTO {
  awardedFinPoints: number;
  totalFinPoints: number;
  level: number;
  didLevelUp: boolean;
  courseProgress: number;
}

export const getLessonDetails = async (
  lessonId: string
): Promise<LessonDetailsDTO> => {
  try {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes da lição ${lessonId}:`, error);
    throw error;
  }
};

export const getLessonQuiz = async (lessonId: string): Promise<QuizQuestion[]> => {
  try {
    const response = await api.get(`/lessons/${lessonId}/quiz`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar quiz da lição ${lessonId}:`, error);
    throw error;
  }
};

export const completeLesson = async (lessonId: string): Promise<LessonCompletionDTO> => {
  try {
    const response = await api.post(`/lessons/${lessonId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao completar lição ${lessonId}:`, error);
    throw error;
  }
};