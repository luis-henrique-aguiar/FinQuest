import React, { useState, useEffect } from "react";
import { BookOpen, Award, TrendingUp, Filter } from "react-feather";
import { CourseCard } from "../components/gamification/CourseCard";
import {
  getCoursesForUser,
  type CourseProgressDTO,
} from "../services/courseService";
import { useToast } from "../hooks/useToast";
import * as S from "./LearnHubPage.styles";

type FilterType = "all" | "in-progress" | "completed" | "not-started";

export const LearnHubPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseProgressDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getCoursesForUser();
        setCourses(data);
      } catch (error) {
        console.error("Falha ao carregar cursos", error);
        addToast(
          "Não foi possível carregar os cursos. Tente novamente.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [addToast]);

  const filteredCourses = courses.filter((course) => {
    const progress = course.progress ?? 0;

    switch (activeFilter) {
      case "in-progress":
        return progress > 0 && progress < 100;
      case "completed":
        return progress === 100;
      case "not-started":
        return progress === 0;
      default:
        return true;
    }
  });

  const stats = {
    total: courses.length,
    inProgress: courses.filter((c) => {
      const p = c.progress ?? 0;
      return p > 0 && p < 100;
    }).length,
    completed: courses.filter((c) => c.progress === 100).length,
  };

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando seus cursos...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.Header>
        <S.HeaderContent>
          <S.Title>
            <BookOpen size={32} />
            Trilhas de Conhecimento
          </S.Title>
          <S.Subtitle>
            Escolha um curso para começar sua jornada e desbloquear novas
            conquistas!
          </S.Subtitle>
        </S.HeaderContent>
      </S.Header>

      <S.StatsGrid>
        <S.StatCard>
          <S.StatIcon color="#007ACC">
            <BookOpen size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.total}</S.StatValue>
            <S.StatLabel>Cursos Disponíveis</S.StatLabel>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon color="#FFA500">
            <TrendingUp size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.inProgress}</S.StatValue>
            <S.StatLabel>Em Progresso</S.StatLabel>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon color="#28A745">
            <Award size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.completed}</S.StatValue>
            <S.StatLabel>Concluídos</S.StatLabel>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      <S.FilterSection>
        <S.FilterHeader>
          <S.FilterTitle>
            <Filter size={20} />
            Filtrar Cursos
          </S.FilterTitle>
        </S.FilterHeader>
        <S.FilterTabs>
          <S.FilterTab
            $active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            Todos ({courses.length})
          </S.FilterTab>
          <S.FilterTab
            $active={activeFilter === "in-progress"}
            onClick={() => setActiveFilter("in-progress")}
          >
            Em Progresso ({stats.inProgress})
          </S.FilterTab>
          <S.FilterTab
            $active={activeFilter === "completed"}
            onClick={() => setActiveFilter("completed")}
          >
            Concluídos ({stats.completed})
          </S.FilterTab>
          <S.FilterTab
            $active={activeFilter === "not-started"}
            onClick={() => setActiveFilter("not-started")}
          >
            Não Iniciados (
            {courses.filter((c) => (c.progress ?? 0) === 0).length})
          </S.FilterTab>
        </S.FilterTabs>
      </S.FilterSection>

      {filteredCourses.length > 0 ? (
        <S.CoursesGrid>
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
        </S.CoursesGrid>
      ) : (
        <S.EmptyState>
          <BookOpen size={64} />
          <h3>Nenhum curso encontrado</h3>
          <p>
            {activeFilter === "all"
              ? "Não há cursos disponíveis no momento."
              : `Você não tem cursos ${
                  activeFilter === "in-progress"
                    ? "em progresso"
                    : activeFilter === "completed"
                    ? "concluídos"
                    : "não iniciados"
                }.`}
          </p>
          {activeFilter !== "all" && (
            <S.ResetFilterButton onClick={() => setActiveFilter("all")}>
              Ver Todos os Cursos
            </S.ResetFilterButton>
          )}
        </S.EmptyState>
      )}
    </S.PageContainer>
  );
};

export default LearnHubPage;
