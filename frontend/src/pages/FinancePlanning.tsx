import React, { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
} from "lucide-react";
import Button from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import {
  type Transaction,
  type TransactionType,
  type CreateTransactionDTO,
  type UpdateTransactionDTO,
  type FinancialOverview,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getFinancialOverview,
  formatCurrency,
  formatMonthYear,
  getCurrentMonthKey,
  monthKeyToRange,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../services/transactionService";
import * as S from "./FinancePlanning.styles";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionDTO | UpdateTransactionDTO) => Promise<void>;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<{
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
    notes: string;
  }>({
    type: "EXPENSE",
    amount: 0,
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          type: initialData.type,
          amount: initialData.amount,
          description: initialData.description,
          category: initialData.category,
          date: initialData.date,
          notes: initialData.notes || "",
        });
      } else {
        setFormData({
          type: "EXPENSE",
          amount: 0,
          description: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: CreateTransactionDTO | UpdateTransactionDTO = {
      type: formData.type,
      amount: formData.amount,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      notes: formData.notes || undefined,
    };

    await onSubmit(data);
  };

  const handleTypeChange = (newType: TransactionType) => {
    setFormData({
      ...formData,
      type: newType,
      category: "",
    });
  };

  const availableCategories =
    formData.type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Transação" : "Nova Transação"}
    >
      <S.ModalContent>
        <S.ModalDescription>
          {initialData
            ? "Edite as informações da transação abaixo."
            : "Preencha os dados para registrar uma nova transação."}
        </S.ModalDescription>

        <S.FormContainer onSubmit={handleSubmit}>
          <S.FormRow>
            <S.InputGroup>
              <S.Label htmlFor="type">Tipo</S.Label>
              <S.Select
                id="type"
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
                required
                disabled={isLoading}
              >
                <option value="EXPENSE">💸 Despesa</option>
                <option value="INCOME">💰 Receita</option>
              </S.Select>
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="amount">Valor (R$)</S.Label>
              <S.Input
                id="amount"
                type="number"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                placeholder="0,00"
                min="0"
                step="0.01"
                required
                disabled={isLoading}
              />
            </S.InputGroup>
          </S.FormRow>

          <S.InputGroup>
            <S.Label htmlFor="description">Descrição</S.Label>
            <S.Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ex: Supermercado, Salário, Conta de luz..."
              required
              disabled={isLoading}
            />
          </S.InputGroup>

          <S.FormRow>
            <S.InputGroup>
              <S.Label htmlFor="category">Categoria</S.Label>
              <S.Select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                disabled={isLoading}
              >
                <option value="">Selecione...</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </S.Select>
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="date">Data</S.Label>
              <S.Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </S.InputGroup>
          </S.FormRow>

          <S.InputGroup>
            <S.Label htmlFor="notes">Observações (opcional)</S.Label>
            <S.TextArea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Alguma observação adicional..."
              disabled={isLoading}
            />
          </S.InputGroup>

          <S.ModalButtonContainer>
            <Button 
              variant="outline" 
              onClick={onClose} 
              type="button"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : initialData ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </S.ModalButtonContainer>
        </S.FormContainer>
      </S.ModalContent>
    </Modal>
  );
};

export const FinancePlanningPage: React.FC = () => {
  // State
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { startDate, endDate } = monthKeyToRange(selectedMonth);
      
      const [transactionsData, overviewData] = await Promise.all([
        getAllTransactions(startDate, endDate),
        getFinancialOverview(startDate, endDate),
      ]);

      setTransactions(transactionsData);
      setOverview(overviewData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      addToast("Erro ao carregar dados financeiros", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = async (data: CreateTransactionDTO) => {
    setIsSubmitting(true);
    
    try {
      await createTransaction(data);
      await fetchData();
      setIsTransactionModalOpen(false);
      
      const message = data.type === "INCOME"
        ? "Receita adicionada com sucesso!"
        : "Despesa adicionada com sucesso!";
      addToast(message, "success");
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      addToast("Erro ao criar transação. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTransaction = async (data: UpdateTransactionDTO) => {
    if (!editingTransaction) return;
    
    setIsSubmitting(true);
    
    try {
      await updateTransaction(editingTransaction.id, data);
      await fetchData();
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
      addToast("Transação atualizada com sucesso!", "success");
    } catch (error) {
      if (error?.response?.data?.details) {
        addToast(`${error.response.data.details[0]}`, "error");
      } else {
        addToast(`Erro ao atualizar transação. Por favor, tente novamente.`, "error");
        console.log(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteTransaction(transactionToDelete.id);
      await fetchData();
      setIsConfirmDeleteOpen(false);
      setTransactionToDelete(null);
      addToast("Transação excluída com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      addToast("Erro ao excluir transação. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTransaction = async (data: CreateTransactionDTO | UpdateTransactionDTO) => {
    if (modalMode === "add") {
      await handleAddTransaction(data as CreateTransactionDTO);
    } else {
      await handleUpdateTransaction(data as UpdateTransactionDTO);
    }
  };

  // Modal openers
  const openAddModal = () => {
    setModalMode("add");
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setModalMode("edit");
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const openDeleteModal = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsConfirmDeleteOpen(true);
  };

  // Navigation
  const navigateMonth = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month - 1);

    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(newMonth);
  };

  const isCurrentMonth = selectedMonth === getCurrentMonthKey();

  return (
    <S.PageContainer>
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        initialData={editingTransaction}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Confirmar Exclusão"
      >
        <S.ModalContent>
          <p>
            Tem certeza que deseja excluir a transação "
            <strong>{transactionToDelete?.description}</strong>"?
          </p>
          <S.ModalDescription>
            Esta ação não pode ser desfeita.
          </S.ModalDescription>
          <S.ModalButtonContainer>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              style={{ backgroundColor: "#DC3545" }}
              onClick={handleDeleteTransaction}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </Button>
          </S.ModalButtonContainer>
        </S.ModalContent>
      </Modal>

      {/* Hero Section */}
      <S.HeroSection>
        <S.HeroHeader>
          <S.HeroContent>
            <S.Title>
              <Wallet size={32} />
              Planejamento Financeiro
            </S.Title>
            <S.Subtitle>
              Acompanhe suas receitas e despesas para manter suas finanças sempre em dia.
            </S.Subtitle>
          </S.HeroContent>

          <S.MonthSelector>
            <S.MonthButton onClick={() => navigateMonth("prev")}>
              <ChevronLeft size={20} />
            </S.MonthButton>
            <S.MonthDisplay>
              {formatMonthYear(selectedMonth)}
              {isCurrentMonth && <S.CurrentBadge>Atual</S.CurrentBadge>}
            </S.MonthDisplay>
            <S.MonthButton onClick={() => navigateMonth("next")}>
              <ChevronRight size={20} />
            </S.MonthButton>
          </S.MonthSelector>
        </S.HeroHeader>

        {/* Stats Grid dentro do Hero */}
        {!isLoading && overview && (
          <S.StatsGrid>
            <S.StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <S.StatIcon $color="#28A745">
                <TrendingUp />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue $color="#28A745">
                  {formatCurrency(overview.totalIncome)}
                </S.StatValue>
                <S.StatLabel>Receitas</S.StatLabel>
              </S.StatContent>
            </S.StatCard>

            <S.StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <S.StatIcon $color="#DC3545">
                <TrendingDown />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue $color="#DC3545">
                  {formatCurrency(overview.totalExpense)}
                </S.StatValue>
                <S.StatLabel>Despesas</S.StatLabel>
              </S.StatContent>
            </S.StatCard>

            <S.StatCard
              $highlight={overview.balance > 0}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <S.StatIcon $color={overview.balance >= 0 ? "#28A745" : "#DC3545"}>
                <DollarSign />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue $color={overview.balance >= 0 ? "#28A745" : "#DC3545"}>
                  {formatCurrency(overview.balance)}
                </S.StatValue>
                <S.StatLabel>Saldo</S.StatLabel>
              </S.StatContent>
            </S.StatCard>

            <S.StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <S.StatIcon $color="#007ACC">
                <Percent />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue>
                  {overview.savingsRate.toFixed(1)}%
                </S.StatValue>
                <S.StatLabel>Taxa de Economia</S.StatLabel>
              </S.StatContent>
            </S.StatCard>
          </S.StatsGrid>
        )}
      </S.HeroSection>

      {/* Loading State */}
      {isLoading ? (
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando dados financeiros...</p>
        </S.LoadingContainer>
      ) : (
        /* Transactions Section */
        <S.SectionContainer>
          <S.SectionHeader>
            <S.SectionTitle>Transações</S.SectionTitle>
            <S.SectionActions>
              <Button
                variant="outline"
                size="small"
                onClick={fetchData}
                icon={<RefreshCw size={16} />}
              >
                Atualizar
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={openAddModal}
                icon={<PlusCircle size={16} />}
              >
                Nova Transação
              </Button>
            </S.SectionActions>
          </S.SectionHeader>

          {transactions.length > 0 ? (
            <S.TransactionsList>
              {transactions.map((transaction, index) => (
                <S.TransactionCard
                  key={transaction.id}
                  $type={transaction.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <S.TransactionIcon $type={transaction.type}>
                    {transaction.type === "INCOME" ? (
                      <ArrowUpCircle />
                    ) : (
                      <ArrowDownCircle />
                    )}
                  </S.TransactionIcon>

                  <S.TransactionInfo>
                    <S.TransactionTitle>{transaction.description}</S.TransactionTitle>
                    <S.TransactionMeta>
                      <S.CategoryBadge>{transaction.category}</S.CategoryBadge>
                      <S.DateText>
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </S.DateText>
                    </S.TransactionMeta>
                    {transaction.notes && (
                      <S.NotesText>{transaction.notes}</S.NotesText>
                    )}
                  </S.TransactionInfo>

                  <S.TransactionRight>
                    <S.TransactionAmount $type={transaction.type}>
                      {transaction.type === "INCOME" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </S.TransactionAmount>
                    <S.ActionButtons>
                      <button
                        onClick={() => openEditModal(transaction)}
                        title="Editar transação"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(transaction)}
                        title="Excluir transação"
                      >
                        <Trash2 size={18} />
                      </button>
                    </S.ActionButtons>
                  </S.TransactionRight>
                </S.TransactionCard>
              ))}
            </S.TransactionsList>
          ) : (
            <S.EmptyState>
              <div className="icon">💸</div>
              <h3>Nenhuma transação registrada</h3>
              <p>
                Comece a registrar suas receitas e despesas para acompanhar
                sua saúde financeira neste período.
              </p>
              <Button
                variant="primary"
                onClick={openAddModal}
                icon={<PlusCircle size={18} />}
              >
                Adicionar Primeira Transação
              </Button>
            </S.EmptyState>
          )}
        </S.SectionContainer>
      )}
    </S.PageContainer>
  );
};

export default FinancePlanningPage;