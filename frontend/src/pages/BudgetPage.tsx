import React, { useState, useMemo } from "react";
import {
  Edit,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import Button from "../components/common/Button";
import SectionTitle from "../components/common/SectionTitle";
import { Modal } from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import * as S from "./BudgetPage.styles";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface MonthlyBudget {
  month: string; // formato: "2024-01"
  budget: number;
}

const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Entretenimento",
  "Roupas",
  "Serviços",
  "Outros Gastos",
];

const INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Vendas",
  "Presente",
  "Outros Ganhos",
];

const TransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Transaction | Omit<Transaction, "id">) => void;
  initialData?: Transaction | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || ("expense" as "income" | "expense"),
    amount: initialData?.amount || 0,
    description: initialData?.description || "",
    category: initialData?.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      ...formData,
      id: initialData?.id || Date.now().toString(),
      date: initialData?.date || new Date().toISOString(),
    };
    onSubmit(transaction);
    onClose();
    setFormData({
      type: "expense",
      amount: 0,
      description: "",
      category: "",
    });
  };

  const handleClose = () => {
    onClose();
    setFormData({
      type: initialData?.type || "expense",
      amount: initialData?.amount || 0,
      description: initialData?.description || "",
      category: initialData?.category || "",
    });
  };

  const handleTypeChange = (newType: "income" | "expense") => {
    setFormData({
      ...formData,
      type: newType,
      category: "",
    });
  };

  const availableCategories =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? "Editar Transação" : "Nova Transação"}
    >
      <S.ModalContent>
        <S.ModalDescription>
          {initialData
            ? "Edite as informações da transação abaixo."
            : "Preencha os dados da nova transação."}
        </S.ModalDescription>

        <S.FormContainer onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Label htmlFor="type">Tipo da Transação</S.Label>
            <S.Select
              id="type"
              value={formData.type}
              onChange={(e) =>
                handleTypeChange(e.target.value as "income" | "expense")
              }
              required
            >
              <option value="expense">💸 Despesa</option>
              <option value="income">💰 Receita</option>
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
            />
          </S.InputGroup>

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
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label htmlFor="category">Categoria</S.Label>
            <S.Select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </S.Select>
          </S.InputGroup>

          <S.ModalButtonContainer>
            <Button variant="outline" onClick={handleClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {initialData ? "Atualizar Transação" : "Adicionar Transação"}
            </Button>
          </S.ModalButtonContainer>
        </S.FormContainer>
      </S.ModalContent>
    </Modal>
  );
};

const SetBudgetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: number) => void;
  currentBudget?: number;
}> = ({ isOpen, onClose, onSave, currentBudget }) => {
  const [budget, setBudget] = useState(currentBudget || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(budget);
    onClose();
    setBudget(0);
  };

  const handleClose = () => {
    onClose();
    setBudget(currentBudget || 0);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Definir Orçamento Mensal"
    >
      <S.ModalContent>
        <S.ModalDescription>
          Defina um limite de gastos para o mês. Isso ajudará você a controlar
          suas despesas e manter suas finanças organizadas.
        </S.ModalDescription>

        <S.FormContainer onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Label htmlFor="budget">Orçamento para Despesas (R$)</S.Label>
            <S.Input
              id="budget"
              type="number"
              value={budget || ""}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="Ex: 2500,00"
              required
              min="0"
              step="0.01"
            />
          </S.InputGroup>

          <S.ModalButtonContainer>
            <Button variant="outline" onClick={handleClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar Orçamento
            </Button>
          </S.ModalButtonContainer>
        </S.FormContainer>
      </S.ModalContent>
    </Modal>
  );
};

export const BudgetPage: React.FC = () => {
  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 3000,
      description: "Salário",
      category: "Salário",
      date: "2024-01-15T10:00:00.000Z",
    },
    {
      id: "2",
      type: "expense",
      amount: 800,
      description: "Aluguel",
      category: "Moradia",
      date: "2024-01-10T10:00:00.000Z",
    },
    {
      id: "3",
      type: "expense",
      amount: 200,
      description: "Supermercado",
      category: "Alimentação",
      date: "2024-01-12T10:00:00.000Z",
    },
    {
      id: "4",
      type: "expense",
      amount: 150,
      description: "Uber",
      category: "Transporte",
      date: "2024-12-14T10:00:00.000Z",
    },
    {
      id: "5",
      type: "income",
      amount: 500,
      description: "Freelance",
      category: "Freelance",
      date: "2024-12-16T10:00:00.000Z",
    },
    {
      id: "6",
      type: "expense",
      amount: 300,
      description: "Conta de luz",
      category: "Moradia",
      date: "2024-11-05T10:00:00.000Z",
    },
  ]);

  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([
    { month: "2024-01", budget: 2500 },
    { month: "2024-11", budget: 3000 },
    { month: "2024-12", budget: 2500 },
  ]);

  const { addToast } = useToast();

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Função para obter o orçamento do mês selecionado
  const getCurrentMonthBudget = () => {
    const budgetData = monthlyBudgets.find((b) => b.month === selectedMonth);
    return budgetData?.budget || null;
  };

  // Filtrar transações do mês selecionado
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return transactionMonth === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const { totalIncome, totalExpense, remainingBalance } = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthBudget = getCurrentMonthBudget();

    return {
      totalIncome: income,
      totalExpense: expense,
      remainingBalance:
        monthBudget !== null ? monthBudget + income - expense : null,
    };
  }, [filteredTransactions, selectedMonth, monthlyBudgets]);

  const handleUpdateTransaction = (
    transactionData: Transaction | Omit<Transaction, "id">
  ) => {
    if (!editingTransaction) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id ? { ...t, ...transactionData } : t
      )
    );
    addToast("Transação atualizada com sucesso!", "success");
  };

  const handleDelete = () => {
    if (!transactionToDelete) return;
    setTransactions((prev) =>
      prev.filter((t) => t.id !== transactionToDelete.id)
    );
    setIsConfirmDeleteOpen(false);
    addToast("Transação excluída.", "success");
  };

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

  const handleAddTransaction = (
    transaction: Transaction | Omit<Transaction, "id">
  ) => {
    const newTransaction = {
      ...transaction,
      id: "id" in transaction ? transaction.id : Date.now().toString(),
      date: new Date().toISOString(),
    } as Transaction;

    setTransactions((prev) => [newTransaction, ...prev]);
    const message =
      newTransaction.type === "income"
        ? "Receita adicionada com sucesso!"
        : "Despesa adicionada com sucesso!";
    addToast(message, "success");
  };

  const handleSaveBudget = (budget: number) => {
    setMonthlyBudgets((prev) => {
      const existing = prev.find((b) => b.month === selectedMonth);
      if (existing) {
        return prev.map((b) =>
          b.month === selectedMonth ? { ...b, budget } : b
        );
      }
      return [...prev, { month: selectedMonth, budget }];
    });
    addToast("Orçamento definido com sucesso!", "success");
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "---";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const date = new Date(year, month - 1);

    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    const newMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    setSelectedMonth(newMonth);
  };

  const isCurrentMonth = selectedMonth === getCurrentMonthKey();
  const currentMonthBudget = getCurrentMonthBudget();

  return (
    <S.PageContainer>
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={
          modalMode === "add" ? handleAddTransaction : handleUpdateTransaction
        }
        initialData={editingTransaction}
      />

      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Confirmar Exclusão"
      >
        <S.ModalContent>
          <p>
            Você tem certeza que deseja excluir a transação "
            <strong>{transactionToDelete?.description}</strong>"?
          </p>
          <S.ModalDescription>
            Esta ação não pode ser desfeita.
          </S.ModalDescription>
          <S.ModalButtonContainer>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              style={{ backgroundColor: "#DC3545" }}
              onClick={handleDelete}
            >
              Sim, Excluir
            </Button>
          </S.ModalButtonContainer>
        </S.ModalContent>
      </Modal>

      <SetBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudget={currentMonthBudget || undefined}
      />

      <S.Header>
        <SectionTitle>Meu Orçamento</SectionTitle>
        {currentMonthBudget !== null && isCurrentMonth && (
          <Button
            variant="primary"
            onClick={openAddModal}
            icon={<PlusCircle size={18} />}
          >
            Adicionar Transação
          </Button>
        )}
      </S.Header>

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

      {currentMonthBudget === null ? (
        <S.BudgetSetupCard>
          <h4>Você ainda não definiu um orçamento para este mês.</h4>
          <p>
            Defina um limite de gastos e comece a registrar suas transações!
          </p>
          <Button variant="outline" onClick={() => setIsBudgetModalOpen(true)}>
            Definir Orçamento Mensal
          </Button>
        </S.BudgetSetupCard>
      ) : (
        <S.SummaryGrid>
          <S.SummaryCard>
            <h3>Orçamento para Gastos</h3>
            <p>{formatCurrency(currentMonthBudget)}</p>
          </S.SummaryCard>
          <S.SummaryCard $textColor="#28A745">
            <h3>Total de Receitas</h3>
            <p>{formatCurrency(totalIncome)}</p>
          </S.SummaryCard>
          <S.SummaryCard $textColor="#DC3545">
            <h3>Total de Despesas</h3>
            <p>{formatCurrency(totalExpense)}</p>
          </S.SummaryCard>
          <S.SummaryCard
            $textColor={
              remainingBalance !== null && remainingBalance >= 0
                ? "#28A745"
                : "#DC3545"
            }
            highlight={remainingBalance !== null && remainingBalance > 0}
          >
            <h3>Dinheiro Restante</h3>
            <p>{formatCurrency(remainingBalance)}</p>
          </S.SummaryCard>
        </S.SummaryGrid>
      )}

      {currentMonthBudget !== null && (
        <S.SectionContainer>
          <S.SectionHeader>
            <SectionTitle>Transações do Período</SectionTitle>
            {isCurrentMonth && (
              <Button
                variant="text"
                onClick={() => setIsBudgetModalOpen(true)}
                size="small"
              >
                Editar Orçamento
              </Button>
            )}
          </S.SectionHeader>
          {filteredTransactions.length > 0 ? (
            <S.TransactionsList>
              {filteredTransactions.map((transaction) => (
                <S.TransactionItem key={transaction.id}>
                  <S.TransactionInfo>
                    <h4>{transaction.description}</h4>
                    <S.CategoryTag>{transaction.category}</S.CategoryTag>
                  </S.TransactionInfo>
                  <S.TransactionActions>
                    <S.TransactionAmount $type={transaction.type}>
                      {transaction.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </S.TransactionAmount>
                    {isCurrentMonth && (
                      <S.ActionButtons>
                        <button onClick={() => openEditModal(transaction)}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => openDeleteModal(transaction)}>
                          <Trash2 size={16} />
                        </button>
                      </S.ActionButtons>
                    )}
                  </S.TransactionActions>
                </S.TransactionItem>
              ))}
            </S.TransactionsList>
          ) : (
            <S.EmptyState>
              <p>Nenhuma transação registrada neste período.</p>
            </S.EmptyState>
          )}
        </S.SectionContainer>
      )}
    </S.PageContainer>
  );
};

export default BudgetPage;
