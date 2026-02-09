import React, { useState } from "react";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type UserSummary,
} from "@/features/admin/services/admin-api";
import Button from "@/components/common/Button";


interface UsersTableProps {
  users: UserSummary[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPromoteUser: (userId: string) => void;
  isLoading?: boolean;
}

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
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 m-0">Usuários</h2>
        </div>
        <div className="p-16 text-center text-zinc-500 dark:text-zinc-400">Carregando...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 m-0">Usuários</h2>
        </div>
        <div className="p-16 text-center text-zinc-500 dark:text-zinc-400">Nenhum usuário encontrado</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 m-0">Usuários ({users.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-50 dark:bg-zinc-950/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Nível</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">FinPoints</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Lições</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Metas</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Última Atividade</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-[#28A745]/15 text-[#28A745]">
                    Nível {user.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                  {user.totalFinPoints.toLocaleString("pt-BR")}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                  {user.completedLessons}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                  {formatDate(user.lastActivityDate)}
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="small"
                    className="h-8 text-xs gap-1.5"
                    icon={<Shield size={14} />}
                    onClick={() => handlePromote(user.id)}
                    disabled={promotingUserId === user.id}
                  >
                    {promotingUserId === user.id ? "Promovendo..." : "Promover"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-5 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Página {currentPage + 1} de {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            className="h-8 w-8 p-0"
            icon={<ChevronLeft size={16} />}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Página anterior"
          />
          <Button
            variant="outline"
            size="small"
            className="h-8 w-8 p-0"
            icon={<ChevronRight size={16} />}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Próxima página"
          />
        </div>
      </div>
    </div>
  );
};
