import React, { useState } from "react";
import styled from "styled-components";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { type UserSummary } from "../../services/adminService"; 
import Button from "../common/Button";

interface UsersTableProps {
  users: UserSummary[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPromoteUser: (userId: string) => void;
  isLoading?: boolean;
}

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const Th = styled.th`
  padding: 16px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const Badge = styled.span<{ $variant: "success" | "info" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $variant, theme }) =>
    $variant === "success" ? theme.colors.secondary : theme.colors.primary}15;
  color: ${({ $variant, theme }) =>
    $variant === "success" ? theme.colors.secondary : theme.colors.primary};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const PageInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.div`
  padding: 60px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onPromoteUser,
  isLoading = false,
}) => {
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handlePromote = async (userId: string) => {
    if (
      window.confirm("Tem certeza que deseja promover este usuário a Admin?")
    ) {
      setPromotingUserId(userId);
      try {
        await onPromoteUser(userId);
      } finally {
        setPromotingUserId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <TableContainer>
        <TableHeader>
          <Title>Usuários</Title>
        </TableHeader>
        <EmptyState>Carregando...</EmptyState>
      </TableContainer>
    );
  }

  if (users.length === 0) {
    return (
      <TableContainer>
        <TableHeader>
          <Title>Usuários</Title>
        </TableHeader>
        <EmptyState>Nenhum usuário encontrado</EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableHeader>
        <Title>Usuários ({users.length})</Title>
      </TableHeader>

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
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                </Td>
                <Td>
                  <Badge $variant="info">Nível {user.level}</Badge>
                </Td>
                <Td>{user.totalFinPoints.toLocaleString("pt-BR")}</Td>
                <Td>{user.completedLessons}</Td>
                <Td>{formatDate(user.lastActivityDate)}</Td>
                <Td>
                  <Button
                    variant="outline"
                    size="small"
                    icon={<Shield size={14} />}
                    onClick={() => handlePromote(user.id)}
                    disabled={promotingUserId === user.id}
                  >
                    {promotingUserId === user.id ? "Promovendo..." : "Promover"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableWrapper>

      <Pagination>
        <PageInfo>
          Página {currentPage + 1} de {totalPages}
        </PageInfo>
        <PageButtons>
          <Button
            variant="outline"
            size="small"
            icon={<ChevronLeft size={16} />}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={<ChevronRight size={16} />}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Próxima
          </Button>
        </PageButtons>
      </Pagination>
    </TableContainer>
  );
};
