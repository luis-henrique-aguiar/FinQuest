import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Users,
  Trophy,
  BookOpen,
  TrendingUp,
  Award,
} from "lucide-react";
import SectionTitle from "../components/common/SectionTitle";
import { StatCard } from "../components/admin/StatCard";
import { UsersTable } from "../components/admin/UsersTable";
import { useToast } from "../hooks/useToast";
import {
  getAdminStats,
  getAllUsers,
  promoteUserToAdmin,
  type AdminStats,
  type UserSummary,
  type PageResponse,
} from "../services/adminService";

const PageContainer = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textMedium};
  margin-top: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const TableSection = styled.div`
  margin-top: 32px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const AdminDashboardPage: React.FC = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<PageResponse<UserSummary> | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      addToast("Erro ao carregar estatísticas do sistema", "error");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadUsers = async (page: number) => {
    try {
      setIsLoadingUsers(true);
      const data = await getAllUsers(page, 20, "name,asc");
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      addToast("Erro ao carregar lista de usuários", "error");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handlePromoteUser = async (userId: string) => {
    try {
      await promoteUserToAdmin(userId);
      addToast("Usuário promovido a Admin com sucesso!", "success");
      loadUsers(currentPage); // Recarregar lista
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      addToast("Erro ao promover usuário", "error");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoadingStats) {
    return (
      <PageContainer>
        <LoadingContainer>Carregando dashboard...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!stats) {
    return (
      <PageContainer>
        <LoadingContainer>Erro ao carregar dados</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <SectionTitle>Dashboard de Administração</SectionTitle>
        <Description>
          Visão geral do sistema e gerenciamento de usuários
        </Description>
      </Header>

      <StatsGrid>
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={Users}
          color="#007ACC"
          subtitle="Cadastrados no sistema"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.activeUsers}
          icon={TrendingUp}
          color="#28A745"
          subtitle="Últimos 30 dias"
        />
        <StatCard
          title="Lições Completadas"
          value={stats.totalLessonsCompleted}
          icon={BookOpen}
          color="#FF6B35"
          subtitle="Total no sistema"
        />
        <StatCard
          title="Missões Completadas"
          value={stats.totalMissionsCompleted}
          icon={Trophy}
          color="#F39C12"
          subtitle="Total no sistema"
        />
        <StatCard
          title="Maior Nível"
          value={stats.highestLevel}
          icon={Award}
          color="#E74C3C"
          subtitle={`Média: ${stats.averageFinPoints.toFixed(0)} pts`}
        />
      </StatsGrid>

      <TableSection>
        <UsersTable
          users={users?.content || []}
          currentPage={currentPage}
          totalPages={users?.totalPages || 0}
          onPageChange={handlePageChange}
          onPromoteUser={handlePromoteUser}
          isLoading={isLoadingUsers}
        />
      </TableSection>
    </PageContainer>
  );
};

export default AdminDashboardPage;
