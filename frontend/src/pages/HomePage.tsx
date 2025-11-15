import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { ArrowRight, Target, Book, TrendingUp } from 'react-feather';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast'; 
import Button from '../components/common/Button';
import { MissionCard } from '../components/gamification/MissionCard';
import { LessonCard } from '../components/gamification/LessonCard'; 
import { DailyGoalItem } from '../components/home/DailyGoalItem';
import { getHomeData } from '../services/homeService';
import { MissionStatus, type MissionProgressDTO } from '../services/missionService';
import { type CourseProgressDTO } from '../services/courseService';
import * as S from './HomePage.styles';
import greetingAnimation from '../assets/animations/hi_girl.json';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [missions, setMissions] = useState<MissionProgressDTO[]>([]);
  const [courses, setCourses] = useState<CourseProgressDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userName = user?.name ? user.name.split(' ')[0] : 'Viajante';
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
      console.error('Erro ao carregar dados da home:', error);
      addToast('Erro ao carregar dados. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra missões recomendadas (em progresso ou não iniciadas)
  const recommendedMissions = missions
    .filter(
      (m) =>
        m.status === MissionStatus.IN_PROGRESS ||
        m.status === MissionStatus.NOT_STARTED
    )
    .slice(0, 3); // Mostra apenas as 3 primeiras

  // Filtra cursos em progresso ou não iniciados
  const activeCourses = courses
    .filter((c) => c.progress === null || (c.progress > 0 && c.progress < 100))
    .slice(0, 3);

  // Estatísticas para "metas diárias" (simuladas por enquanto)
  const dailyGoals = [
    {
      id: 1,
      title: 'Completar uma lição',
      progress: missions.filter((m) => m.status === MissionStatus.COMPLETED).length > 0 ? 1 : 0,
      total: 1,
    },
    {
      id: 2,
      title: 'Explorar 3 missões',
      progress: Math.min(
        missions.filter((m) => m.status === MissionStatus.IN_PROGRESS).length,
        3
      ),
      total: 3,
    },
  ];

  const stats = {
    totalMissions: missions.length,
    completedMissions: missions.filter((m) => m.status === MissionStatus.COMPLETED).length,
    activeCourses: activeCourses.length,
  };

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando sua jornada...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      {/* Notificação para completar o perfil */}
      {isProfileIncomplete && (
        <S.NotificationCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/profile')}
        >
          <h4>Complete seu Perfil! 🎨</h4>
          <p>Adicione um avatar e outras informações para personalizar sua jornada.</p>
        </S.NotificationCard>
      )}

      {/* Seção de Boas-Vindas */}
      <S.WelcomeSection padding="large">
        <S.WelcomeHeader>
          <S.WelcomeText>
            <h1>Olá, {userName}! 👋</h1>
            <p>Vamos continuar sua jornada financeira hoje?</p>
          </S.WelcomeText>
          <Lottie
            animationData={greetingAnimation}
            loop={true}
            style={{ width: 150, height: 150, marginTop: '-20px' }}
          />
        </S.WelcomeHeader>
        <Button onClick={() => navigate('/learn')}>
          Continuar Aprendendo
          <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </Button>
      </S.WelcomeSection>

      {/* Cards de Estatísticas */}
      <S.StatsGrid>
        <S.StatCard onClick={() => navigate('/missions')}>
          <S.StatIcon color="#007ACC">
            <Target size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.completedMissions}/{stats.totalMissions}</S.StatValue>
            <S.StatLabel>Missões Concluídas</S.StatLabel>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard onClick={() => navigate('/learn')}>
          <S.StatIcon color="#28A745">
            <Book size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.activeCourses}</S.StatValue>
            <S.StatLabel>Cursos Ativos</S.StatLabel>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard onClick={() => navigate('/profile')}>
          <S.StatIcon color="#FFA500">
            <TrendingUp size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{user?.level || 1}</S.StatValue>
            <S.StatLabel>Nível Atual</S.StatLabel>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      {/* Seção de Metas Diárias */}
      <S.DailyGoalsSection>
        <S.SectionTitle>Metas Diárias 🎯</S.SectionTitle>
        {dailyGoals.map((goal) => (
          <DailyGoalItem
            key={goal.id}
            title={goal.title}
            progress={goal.progress}
            total={goal.total}
          />
        ))}
      </S.DailyGoalsSection>

      {/* Seção de Cursos em Progresso */}
      {activeCourses.length > 0 && (
        <S.MissionsSection>
          <S.SectionHeader>
            <S.SectionTitle>Continue Aprendendo 📚</S.SectionTitle>
            <S.ViewAllLink onClick={() => navigate('/learn')}>
              Ver todos
            </S.ViewAllLink>
          </S.SectionHeader>

          <S.CoursesGrid>
            {activeCourses.map((course) => (
              <LessonCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/learn/${course.id}`)}
              />
            ))}
          </S.CoursesGrid>
        </S.MissionsSection>
      )}

      {/* Seção de Missões */}
      {recommendedMissions.length > 0 && (
        <S.MissionsSection>
          <S.SectionHeader>
            <S.SectionTitle>Missões Recomendadas 🏆</S.SectionTitle>
            <S.ViewAllLink onClick={() => navigate('/missions')}>
              Ver todas
            </S.ViewAllLink>
          </S.SectionHeader>

          <S.MissionsGrid>
            {recommendedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </S.MissionsGrid>
        </S.MissionsSection>
      )}

      {/* Estado vazio se não houver conteúdo */}
      {activeCourses.length === 0 && recommendedMissions.length === 0 && (
        <S.EmptyState>
          <Book size={64} />
          <h3>Comece sua jornada!</h3>
          <p>Explore os cursos disponíveis e comece a aprender sobre educação financeira.</p>
          <Button onClick={() => navigate('/learn')} style={{ marginTop: '16px' }}>
            Explorar Cursos
          </Button>
        </S.EmptyState>
      )}
    </S.PageContainer>
  );
};

export default HomePage;