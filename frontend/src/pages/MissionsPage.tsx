import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Target, Award, TrendingUp } from "react-feather";
import { MissionCard } from "../components/gamification/MissionCard";
import {
  getMissionsForUser,
  MissionCategory,
  MissionStatus,
  type MissionProgressDTO,
} from "../services/missionService";
import { useToast } from "../hooks/useToast";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatIconContainer = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => `${color}22`};

  svg {
    width: 28px;
    height: 28px;
    color: ${({ color }) => color};
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: 2px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.border};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.white};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.textMedium};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const MissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMedium};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  gap: ${({ theme }) => theme.spacing.md};

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.colors.backgroundAlt};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

type FilterType = "ALL" | MissionStatus | MissionCategory;

export const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<MissionProgressDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const { addToast } = useToast();

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      const data = await getMissionsForUser();
      setMissions(data);
    } catch (error) {
      console.error("Erro ao carregar missões:", error);
      addToast("Erro ao carregar missões. Tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMissions = missions.filter((mission) => {
    if (activeFilter === "ALL") return true;
    if (
      activeFilter === MissionStatus.COMPLETED ||
      activeFilter === MissionStatus.IN_PROGRESS ||
      activeFilter === MissionStatus.NOT_STARTED
    ) {
      return mission.status === activeFilter;
    }
    return mission.category === activeFilter;
  });

  const stats = {
    total: missions.length,
    completed: missions.filter((m) => m.status === MissionStatus.COMPLETED)
      .length,
    inProgress: missions.filter((m) => m.status === MissionStatus.IN_PROGRESS)
      .length,
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <div className="spinner" />
          <p>Carregando missões...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <Target size={32} />
          Missões
        </Title>
        <Subtitle>
          Complete desafios e ganhe recompensas para acelerar seu aprendizado!
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIconContainer color="#007ACC">
            <Target />
          </StatIconContainer>
          <StatContent>
            <StatLabel>Total de Missões</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIconContainer color="#28A745">
            <Award />
          </StatIconContainer>
          <StatContent>
            <StatLabel>Concluídas</StatLabel>
            <StatValue>{stats.completed}</StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIconContainer color="#FFA500">
            <TrendingUp />
          </StatIconContainer>
          <StatContent>
            <StatLabel>Em Progresso</StatLabel>
            <StatValue>{stats.inProgress}</StatValue>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <FilterTabs>
        <FilterTab
          active={activeFilter === "ALL"}
          onClick={() => setActiveFilter("ALL")}
        >
          Todas
        </FilterTab>
        <FilterTab
          active={activeFilter === MissionStatus.IN_PROGRESS}
          onClick={() => setActiveFilter(MissionStatus.IN_PROGRESS)}
        >
          Em Progresso
        </FilterTab>
        <FilterTab
          active={activeFilter === MissionStatus.COMPLETED}
          onClick={() => setActiveFilter(MissionStatus.COMPLETED)}
        >
          Concluídas
        </FilterTab>
        <FilterTab
          active={activeFilter === MissionCategory.LEARNING}
          onClick={() => setActiveFilter(MissionCategory.LEARNING)}
        >
          Aprendizado
        </FilterTab>
        <FilterTab
          active={activeFilter === MissionCategory.BUDGET}
          onClick={() => setActiveFilter(MissionCategory.BUDGET)}
        >
          Orçamento
        </FilterTab>
        <FilterTab
          active={activeFilter === MissionCategory.GOALS}
          onClick={() => setActiveFilter(MissionCategory.GOALS)}
        >
          Metas
        </FilterTab>
      </FilterTabs>

      {filteredMissions.length > 0 ? (
        <MissionsGrid>
          {filteredMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </MissionsGrid>
      ) : (
        <EmptyState>
          <Target />
          <h3>Nenhuma missão encontrada</h3>
          <p>Ajuste os filtros ou complete missões para desbloquear novas!</p>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MissionsPage;
