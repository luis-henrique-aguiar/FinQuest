import React, { useEffect, useState } from "react";
import { Target, Award, TrendingUp } from "react-feather";
import { MissionCard } from "../components/gamification/MissionCard";
import {
  getMissionsForUser,
  MissionCategory,
  MissionStatus,
  type MissionProgressDTO,
} from "../services/missionService";
import { useToast } from "../hooks/useToast";
import * as S from "./MissionsPage.styles";

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
    completed: missions.filter((m) => m.status === MissionStatus.COMPLETED).length,
    inProgress: missions.filter((m) => m.status === MissionStatus.IN_PROGRESS).length,
  };

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando missões...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.Header>
        <S.Title>
          <Target size={32} />
          Missões
        </S.Title>
        <S.Subtitle>
          Complete desafios e ganhe recompensas para acelerar seu aprendizado!
        </S.Subtitle>
      </S.Header>

      <S.StatsGrid>
        <S.StatCard>
          <S.StatIconContainer $color="#007ACC">
            <Target />
          </S.StatIconContainer>
          <S.StatContent>
            <S.StatLabel>Total de Missões</S.StatLabel>
            <S.StatValue>{stats.total}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIconContainer $color="#28A745">
            <Award />
          </S.StatIconContainer>
          <S.StatContent>
            <S.StatLabel>Concluídas</S.StatLabel>
            <S.StatValue>{stats.completed}</S.StatValue>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIconContainer $color="#FFA500">
            <TrendingUp />
          </S.StatIconContainer>
          <S.StatContent>
            <S.StatLabel>Em Progresso</S.StatLabel>
            <S.StatValue>{stats.inProgress}</S.StatValue>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      <S.FilterTabs>
        <S.FilterTab
          $active={activeFilter === "ALL"}
          onClick={() => setActiveFilter("ALL")}
        >
          Todas
        </S.FilterTab>
        <S.FilterTab
          $active={activeFilter === MissionStatus.IN_PROGRESS}
          onClick={() => setActiveFilter(MissionStatus.IN_PROGRESS)}
        >
          Em Progresso
        </S.FilterTab>
        <S.FilterTab
          $active={activeFilter === MissionStatus.COMPLETED}
          onClick={() => setActiveFilter(MissionStatus.COMPLETED)}
        >
          Concluídas
        </S.FilterTab>
        <S.FilterTab
          $active={activeFilter === MissionCategory.LEARNING}
          onClick={() => setActiveFilter(MissionCategory.LEARNING)}
        >
          Aprendizado
        </S.FilterTab>
        <S.FilterTab
          $active={activeFilter === MissionCategory.BUDGET}
          onClick={() => setActiveFilter(MissionCategory.BUDGET)}
        >
          Orçamento
        </S.FilterTab>
        <S.FilterTab
          $active={activeFilter === MissionCategory.GOALS}
          onClick={() => setActiveFilter(MissionCategory.GOALS)}
        >
          Metas
        </S.FilterTab>
      </S.FilterTabs>

      {filteredMissions.length > 0 ? (
        <S.MissionsGrid>
          {filteredMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </S.MissionsGrid>
      ) : (
        <S.EmptyState>
          <Target size={64} />
          <h3>Nenhuma missão encontrada</h3>
          <p>Ajuste os filtros ou complete missões para desbloquear novas!</p>
        </S.EmptyState>
      )}
    </S.PageContainer>
  );
};

export default MissionsPage;