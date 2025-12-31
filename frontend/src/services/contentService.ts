import api from './api';
import { type LessonDetailsDTO } from './lessonService';

export interface LessonSummaryDTO {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  lessonOrder: number;
  isDraft: boolean;
  lastModified: string;
}

export interface LessonCreateDTO {
  title: string;
  courseId: string;
  lessonOrder: number;
  content: string;
  recFinPoints: number;
  isDraft?: boolean;
}

export interface LessonUpdateDTO {
  title?: string;
  content?: string;
  recFinPoints?: number;
  isDraft?: boolean;
}

export interface QuizOptionDTO {
  letter: string;
  text: string;
}

export interface QuizCreateDTO {
  question: string;
  options: QuizOptionDTO[];
  correctAnswer: string;
  explanation: string;
}

export const getAllLessons = async (
  courseId?: string,
  isDraft?: boolean
): Promise<LessonSummaryDTO[]> => {
  try {
    const params: any = {};
    if (courseId !== undefined) params.courseId = courseId;
    if (isDraft !== undefined) params.isDraft = isDraft;

    const response = await api.get('/admin/lessons', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lições:', error);
    throw error;
  }
};

export const getLessonContent = async (lessonId: string): Promise<string> => {
  try {
    const response = await api.get(`/admin/lessons/${lessonId}/content`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar conteúdo da lição ${lessonId}:`, error);
    throw error;
  }
};

export const createLesson = async (
  dto: LessonCreateDTO
): Promise<LessonDetailsDTO> => {
  try {
    const response = await api.post('/admin/lessons', dto);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar lição:', error);
    throw error;
  }
};

export const updateLesson = async (
  lessonId: string,
  dto: LessonUpdateDTO
): Promise<void> => {
  try {
    await api.put(`/admin/lessons/${lessonId}`, dto);
  } catch (error) {
    console.error(`Erro ao atualizar lição ${lessonId}:`, error);
    throw error;
  }
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  try {
    await api.delete(`/admin/lessons/${lessonId}`);
  } catch (error) {
    console.error(`Erro ao deletar lição ${lessonId}:`, error);
    throw error;
  }
};

export const updateQuiz = async (
  lessonId: string,
  questions: QuizCreateDTO[]
): Promise<void> => {
  try {
    await api.put(`/admin/lessons/${lessonId}/quiz`, questions);
  } catch (error) {
    console.error(`Erro ao atualizar quiz da lição ${lessonId}:`, error);
    throw error;
  }
};

export const saveDraft = async (
  lessonId: string,
  content: string
): Promise<void> => {
  try {
    await updateLesson(lessonId, { content, isDraft: true });
  } catch (error) {
    console.error(`Erro ao salvar rascunho da lição ${lessonId}:`, error);
    throw error;
  }
};

export const getAllCourses = async (): Promise<{ id: string; title: string; description: string }[]> => {
  try {
    const response = await api.get('/admin/courses');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    throw error;
  }
};

export const getOccupiedLessonOrders = async (courseId: string): Promise<number[]> => {
  try {
    const response = await api.get(`/admin/courses/${courseId}/lesson-orders`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ordens ocupadas para o curso ${courseId}:`, error);
    throw error;
  }
};

export interface CourseWithLessons {
  id: string;
  title: string;
  description: string;
  lessons: LessonSummaryDTO[];
}

export const getCoursesWithLessons = async (): Promise<CourseWithLessons[]> => {
  try {
    const response = await api.get('/admin/courses-with-lessons');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cursos com lições:', error);
    throw error;
  }
};

export const contentService = {
  getAllLessons,
  getLessonContent,
  createLesson,
  updateLesson,
  deleteLesson,
  updateQuiz,
  saveDraft,
  getAllCourses,
  getOccupiedLessonOrders,
  getCoursesWithLessons,
};

export default contentService;
