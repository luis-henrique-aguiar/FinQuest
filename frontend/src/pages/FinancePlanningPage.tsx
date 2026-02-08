import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  type Transaction,
  type TransactionType,
  type CreateTransactionDTO,
  type UpdateTransactionDTO,
  formatCurrency,
  formatMonthYear,
  getCurrentMonthKey,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/features/finance/services/transaction-api';
import {
  useTransactions,
  useFinancialOverview,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/features/finance/hooks/useTransactions';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateTransactionDTO | UpdateTransactionDTO
  ) => Promise<void>;
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
    amount: string;
    description: string;
    category: string;
    date: string;
    notes: string;
  }>({
    type: 'EXPENSE',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          type: initialData.type,
          amount: String(initialData.amount),
          description: initialData.description,
          category: initialData.category,
          date: initialData.date,
          notes: initialData.notes || '',
        });
      } else {
        setFormData({
          type: 'EXPENSE',
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          notes: '',
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateTransactionDTO | UpdateTransactionDTO = {
      type: formData.type,
      amount: Number(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      notes: formData.notes || undefined,
    };

    await onSubmit(data);
  };

  const handleTypeChange = (newType: string) => {
    setFormData({
      ...formData,
      type: newType as TransactionType,
      category: '',
    });
  };

  const availableCategories =
    formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Edite as informações da transação abaixo.'
              : 'Preencha os dados para registrar uma nova transação.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
                disabled={isLoading}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">💸 Despesa</SelectItem>
                  <SelectItem value="INCOME">💰 Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0,00"
                min="0"
                step="0.01"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isLoading}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Alguma observação adicional..."
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Salvando...'
                : initialData
                  ? 'Salvar Alterações'
                  : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const FinancePlanningPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { data: transactions = [], isLoading: isLoadingTransactions, refetch: refetchTransactions } = useTransactions(selectedMonth);
  const { data: overview, isLoading: isLoadingOverview } = useFinancialOverview(selectedMonth);

  const createMutation = useCreateTransaction(selectedMonth);
  const updateMutation = useUpdateTransaction(selectedMonth);
  const deleteMutation = useDeleteTransaction(selectedMonth);

  const isLoading = isLoadingTransactions || isLoadingOverview;
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleAddTransaction = async (data: CreateTransactionDTO) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Transação adicionada com sucesso!');
      setIsTransactionModalOpen(false);
    } catch (error) {
      toast.error('Erro ao adicionar transação.');
    }
  };

  const handleUpdateTransaction = async (data: UpdateTransactionDTO) => {
    if (!editingTransaction) return;

    try {
      await updateMutation.mutateAsync({ id: editingTransaction.id, data });
      toast.success('Transação atualizada com sucesso!');
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      toast.error('Erro ao atualizar transação.');
    }
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteMutation.mutateAsync(transactionToDelete.id);
      toast.success('Transação excluída com sucesso!');
      setIsConfirmDeleteOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir transação.');
    }
  };

  const handleSubmitTransaction = async (
    data: CreateTransactionDTO | UpdateTransactionDTO
  ) => {
    if (modalMode === 'add') {
      await handleAddTransaction(data as CreateTransactionDTO);
    } else {
      await handleUpdateTransaction(data as UpdateTransactionDTO);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setModalMode('edit');
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const openDeleteModal = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsConfirmDeleteOpen(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1);

    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    const newMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  const isCurrentMonth = selectedMonth === getCurrentMonthKey();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8 pb-20">
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
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a transação "<strong>{transactionToDelete?.description}</strong>"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTransaction}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Wallet size={24} />
              </div>
              Planejamento Financeiro
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
              Acompanhe suas receitas e despesas para manter suas finanças sempre em dia.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="rounded-full w-8 h-8">
              <ChevronLeft size={18} />
            </Button>
            <div className="flex items-center gap-2 px-2 font-medium min-w-[140px] justify-center text-zinc-900 dark:text-zinc-50">
              {formatMonthYear(selectedMonth)}
              {isCurrentMonth && (
                <Badge variant="secondary" className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5">ATUAL</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="rounded-full w-8 h-8">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {!isLoading && overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 leading-tight">
                  {formatCurrency(overview.totalIncome)}
                </div>
                <div className="text-sm text-zinc-500 font-medium">Receitas</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <TrendingDown size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 leading-tight">
                  {formatCurrency(overview.totalExpense)}
                </div>
                <div className="text-sm text-zinc-500 font-medium">Despesas</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border-2 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300",
                overview.balance >= 0
                  ? "border-green-100 dark:border-green-900/20"
                  : "border-red-100 dark:border-red-900/20"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                overview.balance >= 0
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              )}>
                <DollarSign size={24} />
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold leading-tight",
                  overview.balance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}>
                  {formatCurrency(overview.balance)}
                </div>
                <div className="text-sm text-zinc-500 font-medium">Saldo</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Percent size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  {overview.savingsRate.toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-500 font-medium">Taxa de Economia</div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-primary rounded-full animate-spin" />
          <p className="text-zinc-500">Carregando dados financeiros...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Transações</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchTransactions()}
                className="gap-2"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Button
                size="sm"
                onClick={openAddModal}
                className="gap-2"
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Nova Transação</span>
              </Button>
            </div>
          </div>

          {!transactions || transactions.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed">
              <div className="text-6xl mb-4 opacity-50">💸</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Nenhuma transação registrada
              </h3>
              <p className="text-zinc-500 max-w-md mb-6">
                Comece a registrar suas receitas e despesas para acompanhar sua saúde financeira neste período.
              </p>
              <Button onClick={openAddModal} className="gap-2">
                <PlusCircle size={18} />
                Adicionar Primeira Transação
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border flex items-center gap-4 hover:shadow-md transition-all duration-200 border-l-4",
                      transaction.type === 'INCOME'
                        ? "border-l-green-500 border-y-zinc-200 border-r-zinc-200 dark:border-y-zinc-800 dark:border-r-zinc-800 hover:border-l-green-600"
                        : "border-l-red-500 border-y-zinc-200 border-r-zinc-200 dark:border-y-zinc-800 dark:border-r-zinc-800 hover:border-l-red-600"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      transaction.type === 'INCOME'
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    )}>
                      {transaction.type === 'INCOME' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                          {transaction.description}
                        </span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                          {transaction.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        {transaction.notes && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px] italic">{transaction.notes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "font-bold text-lg whitespace-nowrap",
                        transaction.type === 'INCOME' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/10"
                          onClick={() => openEditModal(transaction)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => openDeleteModal(transaction)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancePlanningPage;
