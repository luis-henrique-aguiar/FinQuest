import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardData } from '@/features/gamification/services/dashboard-api';
import {
    MissionStatus,
    type MissionProgressDTO,
} from '@/features/gamification/services/missions-api';
import {
    type CourseProgressDTO,
    enrollInCourse,
} from '@/features/course/services/course-api';

export const useDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [missions, setMissions] = useState<MissionProgressDTO[]>([]);
    const [courses, setCourses] = useState<CourseProgressDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrollingId, setIsEnrollingId] = useState<string | null>(null);

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            setIsLoading(true);
            const data = await getDashboardData();
            setMissions(data.missions);
            setCourses(data.courses);
        } catch (error) {
            console.error("Erro ao carregar dados da home:", error);
            addToast("Erro ao carregar dados. Tente novamente.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCourseClick = async (course: CourseProgressDTO) => {
        if (isEnrollingId) return;

        if (course.progress !== null && course.progress !== undefined) {
            navigate(`/learn/${course.id}`);
            return;
        }

        try {
            setIsEnrollingId(course.id);
            addToast(`Matriculando em ${course.title}...`, "info");

            await enrollInCourse(course.id);

            addToast(`Matrícula realizada com sucesso!`, "success");

            setCourses((prev) =>
                prev.map((c) => (c.id === course.id ? { ...c, progress: 0 } : c))
            );

            navigate(`/learn/${course.id}`);
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setCourses((prev) =>
                    prev.map((c) =>
                        c.id === course.id ? { ...c, progress: c.progress ?? 0 } : c
                    )
                );

                navigate(`/learn/${course.id}`);
                return;
            }

            console.error("Erro ao matricular:", error);
            addToast("Erro ao realizar matrícula. Tente novamente.", "error");
        } finally {
            setIsEnrollingId(null);
        }
    };

    const recommendedMissions = missions
        .filter(
            (m) =>
                m.status === MissionStatus.IN_PROGRESS ||
                m.status === MissionStatus.NOT_STARTED
        )
        .slice(0, 3);

    const activeCourses = courses
        .filter((c) => c.progress === null || (c.progress > 0 && c.progress < 100))
        .slice(0, 3);

    const stats = {
        totalMissions: missions.length,
        completedMissions: missions.filter(
            (m) => m.status === MissionStatus.COMPLETED
        ).length,
        activeCourses: activeCourses.length,
    };

    const userName = user?.name ? user.name.split(" ")[0] : "Viajante";
    const isProfileIncomplete = !user?.avatarUrl || !user.name;

    return {
        isLoading,
        user,
        userName,
        isProfileIncomplete,
        stats,
        activeCourses,
        recommendedMissions,
        handleCourseClick,
        navigate,
    };
};
