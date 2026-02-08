import api from '@/services/api';

/**
 * Course Feature - API Service
 */

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

/**
 * Get all courses for the current user
 */
export const getCoursesForUser = async (): Promise<CourseProgressDTO[]> => {
    const response = await api.get<CourseProgressDTO[]>('/courses');
    return response.data;
};

/**
 * Get course details including lessons
 */
export const getCourseDetails = async (courseId: string): Promise<CourseDetailsDTO> => {
    const response = await api.get<CourseDetailsDTO>(`/courses/${courseId}/details`);
    return response.data;
};

/**
 * Enroll user in a course
 */
export const enrollInCourse = async (courseId: string): Promise<void> => {
    await api.post(`/courses/${courseId}/enroll`);
};
