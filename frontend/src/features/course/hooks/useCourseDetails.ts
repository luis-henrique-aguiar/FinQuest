import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCourse } from '@/features/course/hooks/useCourse';

export const useCourseDetails = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    // TanStack Query hook
    const { data: courseDetails, isLoading, error } = useCourse(courseId);

    // Show error toast and redirect
    useEffect(() => {
        if (error) {
            toast.error('Erro ao carregar curso. Tente novamente.');
            navigate('/learn');
        }
    }, [error, navigate]);

    const handleLessonClick = (lessonId: string) => {
        if (courseId) {
            navigate(`/learn/${courseId}/${lessonId}`);
        }
    };

    // Calculate progress
    const progressStats = useMemo(() => {
        if (!courseDetails) return { completedCount: 0, totalCount: 0, progressPercentage: 0 };

        const completedCount = courseDetails.lessons.filter((l) => l.isCompleted).length;
        const totalCount = courseDetails.lessons.length;
        const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return { completedCount, totalCount, progressPercentage };
    }, [courseDetails]);

    return {
        courseDetails,
        isLoading,
        error,
        handleLessonClick,
        progressStats,
        navigate,
    };
};
