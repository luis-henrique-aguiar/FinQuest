import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Trophy,
  Award,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
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
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.animations.medium} ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => `${$color}22`};
  flex-shrink: 0;

  svg {
    width: 32px;
    height: 32px;
    color: ${({ $color }) => $color};
  }
`;

const StatContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1;
`;

const StatSubtext = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const TableSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const TableHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
`;

const TableTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

const TableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    transition: background ${({ theme }) => theme.animations.fast};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.background};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.animations.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
  vertical-align: middle;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  color: ${({ theme }) => theme.colors.textMedium};
`;

const Badge = styled.span<{ $variant: "success" | "info" | "warning" }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  background: ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return `${theme.colors.success}22`;
      case "info":
        return `${theme.colors.primary}22`;
      case "warning":
        return `${theme.colors.warning}22`;
    }
  }};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return theme.colors.success;
      case "info":
        return theme.colors.primary;
      case "warning":
        return theme.colors.warning;
    }
  }};
`;

const ActionButton = styled.button<{ $variant: "primary" | "outline" }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ $variant, theme }) => {
    if ($variant === "primary") {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        border-color: ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary}dd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${theme.colors.primary}44;
        }
      `;
    } else {
      return `
        background: transparent;
        color: ${theme.colors.primary};
        border-color: ${theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary}11;
          border-color: ${theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const PageInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PageButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
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
    color: ${({ theme }) => theme.colors.textLight};
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    color: ${({ theme }) => theme.colors.textDark};
  }

  p {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${({ theme }) => theme.spacing.md};

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.colors.backgroundAlt};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  p {
    color: ${({ theme }) => theme.colors.textMedium};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

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
      <PageContainer>
        <LoadingContainer>
          <div className="spinner" />
          <p>Carregando dashboard...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!stats) {
    return (
      <PageContainer>
        <EmptyState>
          <Shield />
          <h3>Erro ao carregar dados</h3>
          <p>Não foi possível carregar as informações do dashboard</p>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <Shield size={32} />
          Painel de Administração
        </Title>
        <Subtitle>Visão geral do sistema e gerenciamento de usuários</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <IconContainer $color="#007ACC">
            <Users />
          </IconContainer>
          <StatContent>
            <StatLabel>Total de Usuários</StatLabel>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatSubtext>Cadastrados no sistema</StatSubtext>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <IconContainer $color="#28A745">
            <TrendingUp />
          </IconContainer>
          <StatContent>
            <StatLabel>Usuários Ativos</StatLabel>
            <StatValue>{stats.activeUsers}</StatValue>
            <StatSubtext>Últimos 30 dias</StatSubtext>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <IconContainer $color="#FFA500">
            <BookOpen />
          </IconContainer>
          <StatContent>
            <StatLabel>Lições Completadas</StatLabel>
            <StatValue>{stats.totalLessonsCompleted}</StatValue>
            <StatSubtext>Total no sistema</StatSubtext>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <IconContainer $color="#FD7E14">
            <Target />
          </IconContainer>
          <StatContent>
            <StatLabel>Metas Concluídas</StatLabel>
            <StatValue>{stats?.totalGoalsCompleted || 0}</StatValue>
            <StatSubtext>Por todos os usuários</StatSubtext>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <IconContainer $color="#17A2B8">
            <Trophy />
          </IconContainer>
          <StatContent>
            <StatLabel>Missões Completadas</StatLabel>
            <StatValue>{stats.totalMissionsCompleted}</StatValue>
            <StatSubtext>Total no sistema</StatSubtext>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <IconContainer $color="#DC3545">
            <Award />
          </IconContainer>
          <StatContent>
            <StatLabel>Maior Nível</StatLabel>
            <StatValue>{stats.highestLevel}</StatValue>
            <StatSubtext>
              Média: {stats.averageFinPoints.toFixed(0)} pts
            </StatSubtext>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <TableSection>
        <TableHeader>
          <TableTitle>Gerenciar Usuários</TableTitle>
        </TableHeader>

        {isLoadingUsers ? (
          <LoadingContainer>
            <div className="spinner" />
            <p>Carregando usuários...</p>
          </LoadingContainer>
        ) : users && users.content.length > 0 ? (
          <>
            <TableWrapper>
              <Table>
                <Thead>
                  <tr>
                    <Th>Usuário</Th>
                    <Th>Nível</Th>
                    <Th>FinPoints</Th>
                    <Th>Lições</Th>
                    <Th>Metas</Th>
                    <Th>Última Atividade</Th>
                    <Th>Ações</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {users.content.map((user) => (
                    <Tr key={user.id}>
                      <Td>
                        <UserInfo>
                          <UserName>{user.name}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                        </UserInfo>
                      </Td>
                      <Td>
                        <Badge $variant="info">{user.level}</Badge>
                      </Td>
                      <Td>{user.totalFinPoints.toLocaleString("pt-BR")}</Td>
                      <Td>{user.completedLessons}</Td>
                      <Td>{user?.completedGoals || 0}</Td>
                      <Td>{formatDate(user.lastActivityDate)}</Td>
                      <Td>
                        <ActionButton
                          $variant="outline"
                          onClick={() => handlePromoteUser(user.id, user.name)}
                          disabled={promotingUserId === user.id}
                        >
                          <Shield size={14} />
                          {promotingUserId === user.id
                            ? "Promovendo..."
                            : "Promover"}
                        </ActionButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>

            <Pagination>
              <PageInfo>
                Página {currentPage + 1} de {users.totalPages}
              </PageInfo>
              <PageButtons>
                <ActionButton
                  $variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ← Anterior
                </ActionButton>
                <ActionButton
                  $variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= users.totalPages - 1}
                >
                  Próxima →
                </ActionButton>
              </PageButtons>
            </Pagination>
          </>
        ) : (
          <EmptyState>
            <Users />
            <h3>Nenhum usuário encontrado</h3>
            <p>Não há usuários cadastrados no sistema</p>
          </EmptyState>
        )}
      </TableSection>
    </PageContainer>
  );
};

export default AdminDashboardPage;
