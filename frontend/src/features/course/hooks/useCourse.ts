import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import {
    getCoursesForUser,
    getCourseDetails,
    enrollInCourse,
} from '../services/course-api';
import {
    getLessonDetails,
    getLessonQuiz,
    completeLesson,
} from '../services/lesson-api';
import type { LessonCompletionDTO } from '../services/lesson-api';

/**
 * Course Feature - TanStack Query Hooks
 */

// Query Keys
export const courseKeys = {
    all: ['courses'] as const,
    lists: () => [...courseKeys.all, 'list'] as const,
    list: (filters?: any) => [...courseKeys.lists(), filters] as const,
    details: () => [...courseKeys.all, 'detail'] as const,
    detail: (id: string) => [...courseKeys.details(), id] as const,
};

export const lessonKeys = {
    all: ['lessons'] as const,
    details: () => [...lessonKeys.all, 'detail'] as const,
    detail: (id: string) => [...lessonKeys.details(), id] as const,
    quiz: (id: string) => [...lessonKeys.all, 'quiz', id] as const,
};

/**
 * Hook to fetch all courses for the user
 */
export function useCourses() {
    return useQuery({
        queryKey: courseKeys.lists(),
        queryFn: getCoursesForUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch course details including lessons
 */
export function useCourse(courseId: string | undefined) {
    return useQuery({
        queryKey: courseKeys.detail(courseId || ''),
        queryFn: () => getCourseDetails(courseId!),
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to enroll in a course
 */
export function useEnrollInCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => enrollInCourse(courseId),

        onSuccess: () => {
            // Invalidate courses list to show updated enrollment
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });

            toast.success('Matriculado no curso com sucesso!');
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao se matricular';
            toast.error(message);
        },
    });
}

/**
 * Hook to fetch lesson details
 */
export function useLesson(lessonId: string | undefined) {
    return useQuery({
        queryKey: lessonKeys.detail(lessonId || ''),
        queryFn: () => getLessonDetails(lessonId!),
        enabled: !!lessonId,
        staleTime: 10 * 60 * 1000, // 10 minutes - lesson content rarely changes
    });
}

/**
 * Hook to fetch lesson quiz
 */
export function useLessonQuiz(lessonId: string | undefined) {
    return useQuery({
        queryKey: lessonKeys.quiz(lessonId || ''),
        queryFn: () => getLessonQuiz(lessonId!),
        enabled: !!lessonId,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to complete a lesson
 */
export function useCompleteLesson() {
    const queryClient = useQueryClient();
    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation({
        mutationFn: ({ lessonId }: { lessonId: string; courseId: string }) =>
            completeLesson(lessonId),

        onSuccess: (data: LessonCompletionDTO, variables) => {
            const { totalFinPoints, level, didLevelUp, courseProgress, unlockedBadge } = data;

            // Update user stats in auth store
            const userUpdate: any = {
                totalFinPoints,
                level,
            };

            // Map BadgeDTO to Achievement if present
            if (unlockedBadge) {
                userUpdate.unlockedBadge = {
                    achievementId: typeof unlockedBadge.id === 'string'
                        ? parseInt(unlockedBadge.id)
                        : unlockedBadge.id,
                    title: unlockedBadge.title,
                    icon: unlockedBadge.icon,
                    unlockedDate: new Date().toISOString(),
                };
            }

            updateUser(userUpdate);

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: lessonKeys.detail(variables.lessonId) });
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });

            // Show success notification
            toast.success(`✅ Lição concluída! +${data.awardedFinPoints} FinPoints`);

            // Show level up notification
            if (didLevelUp) {
                toast.success(`🎉 Parabéns! Você subiu para o nível ${level}!`, {
                    duration: 5000,
                });
            }

            // Show badge unlock notification
            if (unlockedBadge) {
                toast.success(`🏆 Conquista desbloqueada: ${unlockedBadge.title}!`, {
                    duration: 5000,
                });
            }

            // Show course progress
            toast.info(`Progresso no curso: ${courseProgress}%`);
        },

        onError: (error: any) => {
            const message = error.response?.data?.message || 'Erro ao completar lição';
            toast.error(message);
        },
    });
}
