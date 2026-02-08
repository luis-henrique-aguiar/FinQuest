import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { ArrowRight, Target, Book, TrendingUp } from "react-feather";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button } from "@/components/ui/button";
import { MissionCard } from "../components/gamification/MissionCard";
import { LessonCard } from "../components/gamification/LessonCard";
import { getHomeData } from "../services/homeService";
import {
  MissionStatus,
  type MissionProgressDTO,
} from "../services/missionService";
import {
  type CourseProgressDTO,
  enrollInCourse,
} from "../services/courseService";
import greetingAnimation from "../assets/animations/hi_girl.json";
import { motion } from "framer-motion";


export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [missions, setMissions] = useState<MissionProgressDTO[]>([]);
  const [courses, setCourses] = useState<CourseProgressDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEnrollingId, setIsEnrollingId] = useState<string | null>(null);

  const userName = user?.name ? user.name.split(" ")[0] : "Viajante";
  const isProfileIncomplete = !user?.avatarUrl || !user.name;

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      const data = await getHomeData();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin dark:border-zinc-700 dark:border-t-zinc-400" />
          <p className="text-zinc-500 dark:text-zinc-400">Carregando sua jornada...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {isProfileIncomplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/profile")}
          className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 p-4 rounded-xl cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
        >
          <h4 className="text-orange-700 dark:text-orange-400 font-bold mb-1">Complete seu Perfil! 🎨</h4>
          <p className="text-orange-600 dark:text-orange-500/80 text-sm">
            Adicione um avatar e outras informações para personalizar sua jornada.
          </p>
        </motion.div>
      )}

      <div className="bg-gradient-to-r from-[#007ACC] to-[#28A745] rounded-3xl p-6 md:p-12 relative overflow-hidden text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-start justify-between md:block mb-6">
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">Olá, {userName}! 👋</h1>
              <p className="text-white/90 text-lg">Vamos continuar sua jornada financeira hoje?</p>
            </div>
            <div className="md:hidden w-24 h-24 -mt-4 -mr-2">
              <Lottie
                animationData={greetingAnimation}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          <Button
            onClick={() => navigate("/learn")}
            className="bg-white text-[#007ACC] hover:bg-white/90 border-none font-bold text-base px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Continuar Aprendendo
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>

        <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64">
          <Lottie
            animationData={greetingAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate("/missions")}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 border border-zinc-100 dark:border-zinc-800"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#007ACC]">
            <Target size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.completedMissions}/{stats.totalMissions}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Missões Concluídas</div>
          </div>
        </div>

        <div
          onClick={() => navigate("/learn")}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 border border-zinc-100 dark:border-zinc-800"
        >
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-[#28A745]">
            <Book size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.activeCourses}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Cursos Ativos</div>
          </div>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 border border-zinc-100 dark:border-zinc-800"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-[#FFA500]">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {user?.level || 1}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Nível Atual</div>
          </div>
        </div>
      </div>

      {activeCourses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Continue Aprendendo 📚</h2>
            <button
              onClick={() => navigate("/learn")}
              className="text-[#007ACC] hover:text-[#005a9e] font-medium text-sm transition-colors bg-transparent border-none cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
              <div
                key={course.id}
                className="h-full flex flex-col"
              >
                <LessonCard
                  course={course}
                  onClick={() => handleCourseClick(course)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {recommendedMissions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Missões Recomendadas 🏆</h2>
            <button
              onClick={() => navigate("/missions")}
              className="text-[#007ACC] hover:text-[#005a9e] font-medium text-sm transition-colors bg-transparent border-none cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </section>
      )}

      {activeCourses.length === 0 && recommendedMissions.length === 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center">
          <Book size={64} className="text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">Comece sua jornada!</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
            Explore os cursos disponíveis e comece a aprender sobre educação financeira.
          </p>
          <Button
            onClick={() => navigate("/learn")}
          >
            Explorar Cursos
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
