import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Trophy,
  Award,
  Shield,
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import {
  getAdminStats,
  getAllUsers,
  promoteUserToAdmin,
  type AdminStats,
  type UserSummary,
  type PageResponse,
} from "../services/adminService";
import * as S from "./AdminDashboardPage.styles";

export const AdminDashboardPage: React.FC = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<PageResponse<UserSummary> | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

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

  const handlePromoteUser = async (userId: string, userName: string) => {
    if (
      !window.confirm(`Tem certeza que deseja promover ${userName} a Admin?`)
    ) {
      return;
    }

    try {
      setPromotingUserId(userId);
      await promoteUserToAdmin(userId);
      addToast(`${userName} foi promovido a Admin com sucesso!`, "success");
      loadUsers(currentPage);
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      addToast("Erro ao promover usuário", "error");
    } finally {
      setPromotingUserId(null);
    }
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
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando dashboard...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  if (!stats) {
    return (
      <S.PageContainer>
        <S.EmptyState>
          <Shield />
          <h3>Erro ao carregar dados</h3>
          <p>Não foi possível carregar as informações do dashboard</p>
        </S.EmptyState>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.Header>
        <S.Title>
          <Shield size={32} />
          Painel de Administração
        </S.Title>
        <S.Subtitle>
          Visão geral do sistema e gerenciamento de usuários
        </S.Subtitle>
      </S.Header>

      <S.StatsGrid>
        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <S.IconContainer $color="#007ACC">
            <Users />
          </S.IconContainer>
          <S.StatContent>
            <S.StatLabel>Total de Usuários</S.StatLabel>
            <S.StatValue>{stats.totalUsers}</S.StatValue>
            <S.StatSubtext>Cadastrados no sistema</S.StatSubtext>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <S.IconContainer $color="#28A745">
            <TrendingUp />
          </S.IconContainer>
          <S.StatContent>
            <S.StatLabel>Usuários Ativos</S.StatLabel>
            <S.StatValue>{stats.activeUsers}</S.StatValue>
            <S.StatSubtext>Últimos 30 dias</S.StatSubtext>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <S.IconContainer $color="#FFA500">
            <BookOpen />
          </S.IconContainer>
          <S.StatContent>
            <S.StatLabel>Lições Completadas</S.StatLabel>
            <S.StatValue>{stats.totalLessonsCompleted}</S.StatValue>
            <S.StatSubtext>Total no sistema</S.StatSubtext>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <S.IconContainer $color="#FD7E14">
            <Target />
          </S.IconContainer>
          <S.StatContent>
            <S.StatLabel>Metas Concluídas</S.StatLabel>
            <S.StatSubtext>Por todos os usuários</S.StatSubtext>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <S.IconContainer $color="#17A2B8">
            <Trophy />
          </S.IconContainer>
          <S.StatContent>
            <S.StatLabel>Missões Completadas</S.StatLabel>
            <S.StatValue>{stats.totalMissionsCompleted}</S.StatValue>
            <S.StatSubtext>Total no sistema</S.StatSubtext>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <S.IconContainer $color="#DC3545">
            <Award />
          </S.IconContainer>
          <S.StatContent>
            <S.StatLabel>Maior Nível</S.StatLabel>
            <S.StatValue>{stats.highestLevel}</S.StatValue>
            <S.StatSubtext>
              Média: {stats.averageFinPoints.toFixed(0)} pts
            </S.StatSubtext>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      <S.TableSection>
        <S.TableHeader>
          <S.TableTitle>Gerenciar Usuários</S.TableTitle>
        </S.TableHeader>

        {isLoadingUsers ? (
          <S.LoadingContainer>
            <div className="spinner" />
            <p>Carregando usuários...</p>
          </S.LoadingContainer>
        ) : users && users.content.length > 0 ? (
          <>
            <S.TableWrapper>
              <S.Table>
                <S.Thead>
                  <tr>
                    <S.Th>Usuário</S.Th>
                    <S.Th>Nível</S.Th>
                    <S.Th>FinPoints</S.Th>
                    <S.Th>Lições</S.Th>
                    <S.Th>Metas</S.Th>
                    <S.Th>Última Atividade</S.Th>
                    <S.Th>Ações</S.Th>
                  </tr>
                </S.Thead>
                <S.Tbody>
                  {users.content.map((user) => (
                    <S.Tr key={user.id}>
                      <S.Td>
                        <S.UserInfo>
                          <S.UserName>{user.name}</S.UserName>
                          <S.UserEmail>{user.email}</S.UserEmail>
                        </S.UserInfo>
                      </S.Td>
                      <S.Td>
                        <S.Badge $variant="info">{user.level}</S.Badge>
                      </S.Td>
                      <S.Td>{user.totalFinPoints.toLocaleString("pt-BR")}</S.Td>
                      <S.Td>{user.completedLessons}</S.Td>
                      <S.Td>{formatDate(user.lastActivityDate)}</S.Td>
                      <S.Td>
                        <S.ActionButton
                          $variant="outline"
                          onClick={() => handlePromoteUser(user.id, user.name)}
                          disabled={promotingUserId === user.id}
                        >
                          <Shield size={14} />
                          {promotingUserId === user.id
                            ? "Promovendo..."
                            : "Promover"}
                        </S.ActionButton>
                      </S.Td>
                    </S.Tr>
                  ))}
                </S.Tbody>
              </S.Table>
            </S.TableWrapper>

            <S.Pagination>
              <S.PageInfo>
                Página {currentPage + 1} de {users.totalPages}
              </S.PageInfo>
              <S.PageButtons>
                <S.ActionButton
                  $variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ← Anterior
                </S.ActionButton>
                <S.ActionButton
                  $variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= users.totalPages - 1}
                >
                  Próxima →
                </S.ActionButton>
              </S.PageButtons>
            </S.Pagination>
          </>
        ) : (
          <S.EmptyState>
            <Users />
            <h3>Nenhum usuário encontrado</h3>
            <p>Não há usuários cadastrados no sistema</p>
          </S.EmptyState>
        )}
      </S.TableSection>
    </S.PageContainer>
  );
};

export default AdminDashboardPage;
