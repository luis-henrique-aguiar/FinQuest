import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Trophy,
  Award,
  Shield,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useAdminStats,
  useAdminUsers,
  usePromoteUser
} from "@/features/admin/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";

export const AdminDashboardPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // TanStack Query hooks
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useAdminStats();
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useAdminUsers(currentPage);
  const promoteUserMutation = usePromoteUser();

  const handlePromoteUser = (userId: string, userName: string) => {
    if (
      !window.confirm(`Tem certeza que deseja promover ${userName} a Admin?`)
    ) {
      return;
    }

    promoteUserMutation.mutate(userId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (isLoadingStats) {
    return (
      <div className="max-w-[1400px] mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando dashboard...</p>
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 gap-4">
          <Shield size={48} className="text-red-500 opacity-60" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Erro ao carregar dados</h3>
          <p className="text-zinc-500 max-w-sm">Não foi possível carregar as informações do dashboard</p>
        </div>
      </div>
    );
  }

  const StatItem = ({ icon: Icon, color, label, value, subtext }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}22` }} // Using hex + opacity
          >
            <Icon size={32} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider font-medium text-zinc-500 mb-1">{label}</div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">{value}</div>
            {subtext && <div className="text-xs text-zinc-400 mt-1">{subtext}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 text-zinc-900 dark:text-zinc-50">
          <Shield className="text-primary w-8 h-8" />
          Painel de Administração
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Visão geral do sistema e gerenciamento de usuários
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatItem
          icon={Users}
          color="#007ACC"
          label="Total de Usuários"
          value={stats.totalUsers}
          subtext="Cadastrados no sistema"
        />
        <StatItem
          icon={TrendingUp}
          color="#28A745"
          label="Usuários Ativos"
          value={stats.activeUsers}
          subtext="Últimos 30 dias"
        />
        <StatItem
          icon={BookOpen}
          color="#FFA500"
          label="Lições Completadas"
          value={stats.totalLessonsCompleted}
          subtext="Total no sistema"
        />
        <StatItem
          icon={Target}
          color="#FD7E14"
          label="Metas Concluídas"
          value={stats.totalMissionsCompleted} // Assuming this maps to missions or goals? Code said Missions
          subtext="Por todos os usuários"
        />
        <StatItem
          icon={Trophy}
          color="#17A2B8"
          label="Missões Completadas"
          value={stats.totalMissionsCompleted}
          subtext="Total no sistema"
        />
        <StatItem
          icon={Award}
          color="#DC3545"
          label="Maior Nível"
          value={stats.highestLevel}
          subtext={`Média: ${stats.averageFinPoints.toFixed(0)} pts`}
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-primary/5 to-transparent">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Gerenciar Usuários</h2>
        </div>

        {isLoadingUsers ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-zinc-500">Carregando usuários...</p>
          </div>
        ) : usersError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <AlertCircle size={32} className="text-red-500 opacity-60" />
            <h3 className="text-lg font-semibold">Erro ao carregar usuários</h3>
            <p className="text-zinc-500">Tente recarregar a página</p>
          </div>
        ) : users && users.content.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nível</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">FinPoints</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lições</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Atividade</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {users.content.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</span>
                          <span className="text-sm text-zinc-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {user.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">
                        {user.totalFinPoints.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                        {user.completedLessons}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {formatDate(user.lastActivityDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePromoteUser(user.id, user.name)}
                          disabled={promoteUserMutation.isPending}
                          className="h-8 gap-1.5 text-zinc-600 hover:text-primary hover:border-primary/50 hover:bg-primary/5"
                        >
                          <Shield size={14} />
                          Promover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900">
              <div className="text-sm text-zinc-500 font-medium">
                Página {currentPage + 1} de {users.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="gap-1 h-9"
                >
                  <ChevronLeft size={16} /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= users.totalPages - 1}
                  className="gap-1 h-9"
                >
                  Próxima <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <Users size={48} className="text-zinc-300" />
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Nenhum usuário encontrado</h3>
            <p className="text-zinc-500">Não há usuários cadastrados no sistema</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
