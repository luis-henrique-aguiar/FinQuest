import React, { useEffect, useState } from 'react';
import MissionCard from '../components/gamification/MissionCard';
import ProgressBar from '../components/gamification/ProgressBar';
import * as S from './MissionsPage.styles';
import { getMissions, type MissionProgressDTO } from '../services/missionService';
import { useToast } from '../hooks/useToast';
import { Spinner } from './RegisterPage.styles';

type MissionCategory = string;

export const MissionsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MissionCategory>('all');
  const [allMissions, setAllMissions] = useState<MissionProgressDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setIsLoading(true);
        const data = await getMissions();
        setAllMissions(data);
      } catch (error) {
        addToast("Erro ao carregar suas missões.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMissions();
  }, [addToast]);

  const filteredMissions = activeCategory === 'all'
    ? allMissions
    : allMissions.filter(mission => mission.category.toLowerCase() === activeCategory);

  const categoryLabels = {
    all: 'Todas',
    LEARNING: 'Aprendizado',
    BUDGET: 'Orçamento',
    GOALS: 'Metas',
  };

  // Estatísticas calculadas
  const completedMissions = allMissions.filter(m => m.status === 'COMPLETED').length;
  const inProgressMissions = allMissions.filter(m => m.status === 'IN_PROGRESS' && m.currentCount > 0).length;
  const notStartedMissions = allMissions.filter(m => m.status === 'NOT_STARTED').length;

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.PageHeader>
          <S.PageTitle>Missões Financeiras</S.PageTitle>
        </S.PageHeader>
        <p style={{ textAlign: 'center' }}>Carregando suas missões...</p>
        <Spinner />
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.PageTitle>Missões Financeiras</S.PageTitle>
        <S.PageDescription>
          Complete missões para ganhar recompensas e melhorar suas finanças
        </S.PageDescription>
      </S.PageHeader>

      {/* Stats agora são calculados */}
      <S.StatsContainer>
        <S.StatCard>
          <div className="stat-value">{completedMissions}</div>
          <div className="stat-label">Concluídas</div>
        </S.StatCard>
        <S.StatCard>
          <div className="stat-value">{inProgressMissions}</div>
          <div className="stat-label">Em Progresso</div>
        </S.StatCard>
        <S.StatCard>
          <div className="stat-value">{notStartedMissions}</div>
          <div className="stat-label">Não Iniciadas</div>
        </S.StatCard>
        <S.StatCard>
          <div className="stat-value">{allMissions.length}</div>
          <div className="stat-label">Total</div>
        </S.StatCard>
      </S.StatsContainer>

      {/* Progresso Geral */}
      <S.ProgressSection>
        <S.ProgressHeader>
          <S.ProgressTitle>Seu Progresso Geral</S.ProgressTitle>
          <S.ProgressStats>
            {completedMissions}/{allMissions.length} missões
          </S.ProgressStats>
        </S.ProgressHeader>
        <ProgressBar
          progress={(completedMissions / allMissions.length) * 100}
          variant="xp"
          height={12}
        />
      </S.ProgressSection>

      {/* Filtros */}
      <S.FilterTabs>
        <S.FilterTab
            key="all"
            $active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          >
            Todas
        </S.FilterTab>
        {/* Mapeia as categorias únicas das missões */}
        {[...new Set(allMissions.map(m => m.category))].map((category) => (
          <S.FilterTab
            key={category}
            $active={activeCategory === category.toLowerCase()}
            onClick={() => setActiveCategory(category.toLowerCase())}
          >
            {/* Usa o label ou o próprio nome da categoria */}
            {categoryLabels[category as keyof typeof categoryLabels] || category}
          </S.FilterTab>
        ))}
      </S.FilterTabs>

      <S.MissionsGrid>
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => {
            const progressPercent = (mission.currentCount / mission.targetCount) * 100;
            const icon = mission.category === 'LEARNING' ? '📚' : (mission.category === 'BUDGET' ? '📊' : '🎯');
            const timeEstimate = "5 min";

            return (
              <MissionCard
                key={mission.id}
                title={mission.title}
                description={mission.description}
                icon={icon}
                progress={progressPercent}
                reward={{ finPoints: mission.rewardFinPoints }}
                timeEstimate={timeEstimate}
                completed={mission.status === 'COMPLETED'}
                locked={false}
                onClick={() => console.log(`Mission ${mission.id} clicked`)}
              />
            );
          })
        ) : (
          <S.EmptyState>
            <span className="emoji">🎯</span>
            <h3>Nenhuma missão encontrada</h3>
            <p>Não há missões disponíveis nesta categoria no momento.</p>
          </S.EmptyState>
        )}
      </S.MissionsGrid>
    </S.PageContainer>
  );
};

export default MissionsPage;