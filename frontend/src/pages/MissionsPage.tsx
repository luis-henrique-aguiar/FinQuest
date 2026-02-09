import React from 'react';
import { Target, Award, TrendingUp } from 'lucide-react';
import { MissionCard } from '@/features/gamification/components/MissionCard';
import {
  MissionCategory,
  MissionStatus,
} from '@/features/gamification/services/missions-api';
import { useMissionsLogic, type FilterType } from '@/features/gamification/hooks/useMissionsLogic';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const MissionsPage: React.FC = () => {
  const {
    isLoading,
    activeFilter,
    setActiveFilter,
    filteredMissions,
    stats,
  } = useMissionsLogic();

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando missões...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
          <Target className="text-primary w-8 h-8" />
          Missões
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Complete desafios e ganhe recompensas para acelerar seu aprendizado!
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total de Missões</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Concluídas</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.completed}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Em Progresso</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.inProgress}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTER TABS */}
      <div className="flex p-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
        {[
          { id: 'ALL', label: 'Todas' },
          { id: MissionStatus.IN_PROGRESS, label: 'Em Progresso' },
          { id: MissionStatus.COMPLETED, label: 'Concluídas' },
          { id: MissionCategory.LEARNING, label: 'Aprendizado' },
          { id: MissionCategory.BUDGET, label: 'Orçamento' },
          { id: MissionCategory.GOALS, label: 'Metas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as FilterType)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
              activeFilter === tab.id
                ? "bg-primary text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MISSIONS GRID */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center gap-4">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
            <Target size={40} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Nenhuma missão encontrada</h3>
          <p className="text-zinc-500 max-w-sm">Ajuste os filtros ou complete missões para desbloquear novas!</p>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;