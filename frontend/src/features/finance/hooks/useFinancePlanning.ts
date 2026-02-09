import { useState } from 'react';
import { toast } from 'sonner';
import {
    type Transaction,
    type CreateTransactionDTO,
    type UpdateTransactionDTO,
    getCurrentMonthKey,
} from '@/features/finance/services/transaction-api';
import {
    useTransactions,
    useFinancialOverview,
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
} from '@/features/finance/hooks/useTransactions';

export const useFinancePlanning = () => {
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

    return {
        selectedMonth,
        setSelectedMonth,
        isTransactionModalOpen,
        setIsTransactionModalOpen,
        modalMode,
        editingTransaction,
        setEditingTransaction,
        transactionToDelete,
        setTransactionToDelete,
        isConfirmDeleteOpen,
        setIsConfirmDeleteOpen,
        transactions,
        overview,
        isLoading,
        isSubmitting,
        refetchTransactions,
        handleSubmitTransaction,
        handleDeleteTransaction,
        openAddModal,
        openEditModal,
        openDeleteModal,
        navigateMonth,
        isCurrentMonth,
    };
};
