import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'react-feather';
import SectionTitle from '../components/common/SectionTitle';
import { LessonCard } from '../components/gamification/LessonCard';
import { getCourseDetails, type CourseDetailsDTO } from '../services/courseService';
import { useToast } from '../hooks/useToast'; 

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    transform: scale(1.1);
  }
`;

const CourseDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textMedium};
  max-width: 600px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [course, setCourse] = useState<CourseDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      addToast("ID do curso não encontrado.", "error");
      navigate('/learn');
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseDetails(courseId);
        setCourse(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do curso:", error);
        addToast("Não foi possível carregar o curso.", "error");
        navigate('/learn');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate, addToast]);

  if (isLoading || !course) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate('/learn')}>
            <ArrowLeft size={20} />
          </BackButton>
          <SectionTitle>Carregando curso...</SectionTitle>
        </Header>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div>
        <Header>
          <BackButton onClick={() => navigate('/learn')} aria-label="Voltar para cursos">
            <ArrowLeft size={20} />
          </BackButton>
          <SectionTitle>{course.title}</SectionTitle>
        </Header>
        <CourseDescription>{course.description}</CourseDescription>
      </div>

      <LessonsGrid>
        {course.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            courseId={course.id}
            lessonId={lesson.id}
            title={lesson.title}
            isCompleted={lesson.isCompleted}
          />
        ))}
      </LessonsGrid>
    </PageContainer>
  );
};