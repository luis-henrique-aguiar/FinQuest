import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CourseCard } from '../components/gamification/CourseCard';
import SectionTitle from '../components/common/SectionTitle'; 
import { getCoursesForUser, type CourseProgressDTO } from '../services/courseService';
import { useToast } from '../hooks/useToast'; 
import { Spinner } from './RegisterPage.styles';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const LearnHubPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseProgressDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getCoursesForUser();
        setCourses(data);
      } catch (error) {
        console.error("Falha ao carregar cursos", error);
        addToast("Não foi possível carregar as trilhas. Tente novamente.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [addToast]);

  if (isLoading) {
    return (
      <PageContainer>
        <SectionTitle>Trilhas de Conhecimento</SectionTitle>
        <p>Carregando suas trilhas...</p>
        <Spinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionTitle>Trilhas de Conhecimento</SectionTitle>
      <p>Escolha um curso para começar sua jornada e desbloquear novas conquistas!</p>
      <CoursesGrid>
        {courses.map(course => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            icon={course.icon}
            progress={course.progress}
          />
        ))}
      </CoursesGrid>
    </PageContainer>
  );
};

export default LearnHubPage;