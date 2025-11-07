import React, { useState } from 'react';
import MissionCard from '../components/gamification/MissionCard';
import ProgressBar from '../components/gamification/ProgressBar';
import * as S from './MissionsPage.styles';

type MissionCategory = 'all' | 'daily' | 'basics' | 'saving' | 'investing' | 'credit';

interface Mission {
  id: number;
  category: MissionCategory;
  title: string;
  description: string;
  icon: string;
  progress: number;
  reward: {
    finPoints?: number;
    coins?: number;
  };
  timeEstimate: string;
  completed?: boolean;
  locked?: boolean;
}

export const MissionsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MissionCategory>('all');

  // Mock data - em uma aplicação real, isso viria de uma API ou contexto
  const progress = {
    completed: 12,
    total: 48,
  };

  const missions: Mission[] = [
    {
      id: 1,
      category: 'daily',
      title: 'Missão Diária: Economize R$10',
      description: 'Registre pelo menos R$10 em economia hoje',
      icon: '💸',
      progress: 50,
      reward: { finPoints: 25, coins: 15 },
      timeEstimate: '5 min',
    },
    {
      id: 2,
      category: 'basics',
      title: 'Fundamentos do Orçamento',
      description: 'Aprenda a criar e manter um orçamento pessoal eficaz',
      icon: '📊',
      progress: 0,
      reward: { finPoints: 50, coins: 25 },
      timeEstimate: '5 min',
    },
    {
      id: 3,
      category: 'saving',
      title: 'Emergências Financeiras',
      description: 'Como criar um fundo de emergência que realmente funciona',
      icon: '🚨',
      progress: 30,
      reward: { finPoints: 75 },
      timeEstimate: '8 min',
    },
    {
      id: 4,
      category: 'investing',
      title: 'Introdução a Investimentos',
      description: 'Conceitos básicos para começar a investir com segurança',
      icon: '📈',
      progress: 0,
      reward: { finPoints: 100, coins: 50 },
      timeEstimate: '10 min',
      locked: true,
    },
    {
      id: 5,
      category: 'credit',
      title: 'Cartão de Crédito Inteligente',
      description: 'Use o crédito a seu favor e evite armadilhas',
      icon: '💳',
      progress: 100,
      reward: { finPoints: 60, coins: 30 },
      timeEstimate: '7 min',
      completed: true,
    },
    {
      id: 6,
      category: 'daily',
      title: 'Registrar Gastos do Dia',
      description: 'Anote todas as suas despesas de hoje',
      icon: '📝',
      progress: 75,
      reward: { finPoints: 20, coins: 10 },
      timeEstimate: '3 min',
    },
    {
      id: 7,
      category: 'basics',
      title: 'Definir Metas Financeiras',
      description: 'Estabeleça objetivos claros para suas finanças',
      icon: '🎯',
      progress: 0,
      reward: { finPoints: 40, coins: 20 },
      timeEstimate: '6 min',
    },
    {
      id: 8,
      category: 'saving',
      title: 'Técnicas de Economia',
      description: 'Aprenda métodos práticos para economizar dinheiro',
      icon: '🏦',
      progress: 60,
      reward: { finPoints: 55, coins: 25 },
      timeEstimate: '7 min',
    },
  ];

  const filteredMissions = activeCategory === 'all'
    ? missions
    : missions.filter(mission => mission.category === activeCategory);

  const categoryLabels = {
    all: 'Todas',
    daily: 'Diárias',
    basics: 'Fundamentos',
    saving: 'Poupança',
    investing: 'Investimentos',
    credit: 'Crédito',
  };

  // Estatísticas calculadas
  const completedMissions = missions.filter(m => m.completed).length;
  const inProgressMissions = missions.filter(m => m.progress > 0 && !m.completed).length;
  const lockedMissions = missions.filter(m => m.locked).length;

  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.PageTitle>Missões Financeiras</S.PageTitle>
        <S.PageDescription>
          Complete missões para ganhar recompensas e melhorar suas finanças
        </S.PageDescription>
      </S.PageHeader>

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
          <div className="stat-value">{lockedMissions}</div>
          <div className="stat-label">Bloqueadas</div>
        </S.StatCard>
        <S.StatCard>
          <div className="stat-value">{missions.length}</div>
          <div className="stat-label">Total</div>
        </S.StatCard>
      </S.StatsContainer>

      <S.ProgressSection>
        <S.ProgressHeader>
          <S.ProgressTitle>Seu Progresso Geral</S.ProgressTitle>
          <S.ProgressStats>
            {progress.completed}/{progress.total} missões
          </S.ProgressStats>
        </S.ProgressHeader>
        <ProgressBar
          progress={(progress.completed / progress.total) * 100}
          variant="xp"
          height={12}
        />
      </S.ProgressSection>

      <S.FilterTabs>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <S.FilterTab
            key={key}
            $active={activeCategory === key}
            onClick={() => setActiveCategory(key as MissionCategory)}
          >
            {label}
          </S.FilterTab>
        ))}
      </S.FilterTabs>

      <S.MissionsGrid>
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              description={mission.description}
              icon={mission.icon}
              progress={mission.progress}
              reward={mission.reward}
              timeEstimate={mission.timeEstimate}
              completed={mission.completed}
              locked={mission.locked}
              onClick={() => console.log(`Mission ${mission.id} clicked`)}
            />
          ))
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