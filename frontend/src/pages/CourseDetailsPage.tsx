import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "react-feather";
import {
  getCourseDetails,
  type CourseDetailsDTO,
} from "../services/courseService";
import { LessonListItem } from "../components/course/LessonListItem";
import { useToast } from "../hooks/useToast"; 
import Button from "../components/common/Button";
import * as S from "./CourseDetailsPage.styles";

export const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [courseDetails, setCourseDetails] = useState<CourseDetailsDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourseDetails(courseId);
    }
  }, [courseId]);

  const loadCourseDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await getCourseDetails(id);
      setCourseDetails(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes do curso:", error);
      addToast("Erro ao carregar curso. Tente novamente.", "error");
      navigate("/learn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/learn/${courseId}/${lessonId}`);
  };

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando curso...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  if (!courseDetails) {
    return (
      <S.PageContainer>
        <S.EmptyState>
          <BookOpen size={64} />
          <h3>Curso não encontrado</h3>
          <p>O curso que você procura não existe ou foi removido.</p>
          <Button onClick={() => navigate("/learn")}>Voltar para Cursos</Button>
        </S.EmptyState>
      </S.PageContainer>
    );
  }

  const completedCount = courseDetails.lessons.filter(
    (l) => l.isCompleted
  ).length;
  const totalCount = courseDetails.lessons.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <S.PageContainer>
      <S.Header>
        <S.BackButton
          onClick={() => navigate("/learn")}
          aria-label="Voltar para cursos"
        >
          <ArrowLeft size={20} />
        </S.BackButton>
        <S.HeaderContent>
          <S.CourseIcon>📚</S.CourseIcon>
          <div>
            <S.CourseTitle>{courseDetails.title}</S.CourseTitle>
            <S.CourseDescription>
              {courseDetails.description}
            </S.CourseDescription>
          </div>
        </S.HeaderContent>
      </S.Header>

      <S.ProgressCard>
        <S.ProgressHeader>
          <S.ProgressTitle>Seu Progresso</S.ProgressTitle>
          <S.ProgressStats>
            {completedCount} de {totalCount} lições concluídas
          </S.ProgressStats>
        </S.ProgressHeader>
        <S.ProgressBarContainer>
          <S.ProgressBarFill
            $progress={progressPercentage}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </S.ProgressBarContainer>
        <S.ProgressPercentage>{progressPercentage}%</S.ProgressPercentage>
      </S.ProgressCard>

      <S.LessonsSection>
        <S.SectionTitle>
          <BookOpen size={24} />
          <span>Lições do Curso</span>
        </S.SectionTitle>

        <S.LessonsList>
          {courseDetails.lessons.map((lesson) => (
            <LessonListItem
              key={lesson.id}
              lesson={lesson}
              isLocked={false}
              onClick={() => handleLessonClick(lesson.id)}
            />
          ))}
        </S.LessonsList>
      </S.LessonsSection>
    </S.PageContainer>
  );
};
