import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useCourse } from '@/features/course/hooks/useCourse';
import { LessonListItem } from '@/components/course/LessonListItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/gamification/ProgressBar';

export const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // TanStack Query hook
  const { data: courseDetails, isLoading, error } = useCourse(courseId);

  // Show error toast
  React.useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar curso. Tente novamente.');
      navigate('/learn');
    }
  }, [error, navigate]);

  const handleLessonClick = (lessonId: string) => {
    navigate(`/learn/${courseId}/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando curso...</p>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
          <BookOpen size={40} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Curso não encontrado</h3>
          <p className="text-zinc-500 mt-2">O curso que você procura não existe ou foi removido.</p>
        </div>
        <Button onClick={() => navigate('/learn')}>Voltar para Cursos</Button>
      </div>
    );
  }

  // Calculate progress
  const completedCount = courseDetails.lessons.filter((l) => l.isCompleted).length;
  const totalCount = courseDetails.lessons.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/learn')}
          className="shrink-0"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-4xl shrink-0">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {courseDetails.title}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {courseDetails.description}
            </p>
          </div>
        </div>
      </div>

      {/* PROGRESS CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex justify-between items-center">
            <span>Seu Progresso</span>
            <span className="text-sm font-normal text-zinc-500">
              {completedCount} de {totalCount} lições concluídas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar
            progress={progressPercentage}
            variant="xp"
            height={10}
            tooltipText={`${progressPercentage}% concluído`}
          />
        </CardContent>
      </Card>

      {/* LESSONS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Lições do Curso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {courseDetails.lessons.map((lesson) => (
            <LessonListItem
              key={lesson.id}
              lesson={lesson}
              isLocked={false}
              onClick={() => handleLessonClick(lesson.id)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailsPage;
