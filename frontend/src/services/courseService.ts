import api from './api';

export interface CourseProgressDTO {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number | null;
}

export interface LessonProgressDTO {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface CourseDetailsDTO {
  id: string;
  title: string;
  description: string;
  lessons: LessonProgressDTO[];
}

export const getCoursesForUser = async (): Promise<CourseProgressDTO[]> => {
  try {
    const response = await api.get('/courses'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    throw error;
  }
};

export const enrollInCourse = async (courseId: string): Promise<void> => {
  try {
    await api.post(`/courses/${courseId}/enroll`);
  } catch (error) {
    console.error(`Erro ao matricular no curso ${courseId}:`, error);
    throw error;
  }
};

export const getCourseDetails = async (courseId: string): Promise<CourseDetailsDTO> => {
  try {
    const response = await api.get(`/courses/${courseId}/details`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
    throw error;
  }
};