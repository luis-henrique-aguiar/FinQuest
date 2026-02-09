import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useCourses } from '@/features/course/hooks/useCourse';

export type FilterType = 'all' | 'in-progress' | 'completed' | 'not-started';

export const useLearnHub = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // TanStack Query hook
    const { data: courses = [], isLoading, error } = useCourses();

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error('Não foi possível carregar os cursos. Tente novamente.');
        }
    }, [error]);

    // Filter courses
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const progress = course.progress ?? 0;

            switch (activeFilter) {
                case 'in-progress':
                    return progress > 0 && progress < 100;
                case 'completed':
                    return progress === 100;
                case 'not-started':
                    return progress === 0;
                default:
                    return true;
            }
        });
    }, [courses, activeFilter]);

    // Statistics
    const stats = useMemo(() => {
        return {
            total: courses.length,
            inProgress: courses.filter((c) => {
                const p = c.progress ?? 0;
                return p > 0 && p < 100;
            }).length,
            completed: courses.filter((c) => c.progress === 100).length,
            notStarted: courses.filter((c) => (c.progress ?? 0) === 0).length,
        };
    }, [courses]);

    return {
        courses,
        isLoading,
        activeFilter,
        setActiveFilter,
        filteredCourses,
        stats,
    };
};
