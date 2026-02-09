import React, { useState, useMemo } from 'react';
import { BookOpen, Award, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { CourseCard } from '@/features/gamification/components/CourseCard';
import { useCourses } from '@/features/course/hooks/useCourse';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'in-progress' | 'completed' | 'not-started';

export const LearnHubPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // TanStack Query hook
  const { data: courses = [], isLoading, error } = useCourses();

  // Show error toast
  React.useEffect(() => {
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

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando seus cursos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
          <BookOpen className="text-primary w-8 h-8" />
          Trilhas de Conhecimento
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Escolha um curso para começar sua jornada e desbloquear novas conquistas!
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</h3>
              <p className="text-sm font-medium text-zinc-500">Cursos Disponíveis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.inProgress}</h3>
              <p className="text-sm font-medium text-zinc-500">Em Progresso</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.completed}</h3>
              <p className="text-sm font-medium text-zinc-500">Concluídos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <Filter className="text-primary w-5 h-5" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Filtrar Cursos</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: `Todos (${stats.total})` },
            { id: 'in-progress', label: `Em Progresso (${stats.inProgress})` },
            { id: 'completed', label: `Concluídos (${stats.completed})` },
            { id: 'not-started', label: `Não Iniciados (${stats.notStarted})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterType)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2",
                activeFilter === tab.id
                  ? "bg-primary text-white border-primary shadow-sm scale-105"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* COURSES GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              icon={course.icon}
              progress={course.progress}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center gap-4">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Nenhum curso encontrado</h3>
          <p className="text-zinc-500 max-w-sm">
            {activeFilter === 'all'
              ? 'Não há cursos disponíveis no momento.'
              : `Você não tem cursos ${activeFilter === 'in-progress'
                ? 'em progresso'
                : activeFilter === 'completed'
                  ? 'concluídos'
                  : 'não iniciados'
              }.`}
          </p>
          {activeFilter !== 'all' && (
            <Button variant="outline" onClick={() => setActiveFilter('all')}>
              Ver Todos os Cursos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnHubPage;
