import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
    useGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
} from '@/features/finance/hooks/useGoals';
import type { GoalDTO } from '@/features/finance/services/goals-api';

export type FilterType = 'all' | 'IN_PROGRESS' | 'COMPLETED';

export const useGoalsLogic = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // TanStack Query hooks
    const { data: goals = [], isLoading } = useGoals();
    const createGoal = useCreateGoal();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();

    // Modal states
    const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
    const [isAddFundsModalOpen, setAddFundsModalOpen] = useState(false);
    const [isCelebrationModalOpen, setCelebrationModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

    // Selected goal
    const [selectedGoal, setSelectedGoal] = useState<GoalDTO | null>(null);

    // Form states
    const [goalName, setGoalName] = useState('');
    const [goalTarget, setGoalTarget] = useState('');
    const [fundsToAdd, setFundsToAdd] = useState('');
    const [currentAmountEdit, setCurrentAmountEdit] = useState('');

    // Determine goal status
    const getNormalizedStatus = (goal: GoalDTO) => {
        if (goal.currentAmount >= goal.targetAmount) {
            return 'COMPLETED';
        }
        return goal.statusLabel;
    };

    // Filtered goals
    const filteredGoals = useMemo(() => {
        switch (activeFilter) {
            case 'IN_PROGRESS':
                return goals.filter((goal) => getNormalizedStatus(goal) !== 'COMPLETED');
            case 'COMPLETED':
                return goals.filter((goal) => getNormalizedStatus(goal) === 'COMPLETED');
            default:
                return goals;
        }
    }, [goals, activeFilter]);

    // Statistics
    const stats = useMemo(() => {
        const activeGoals = goals.filter(
            (goal) => getNormalizedStatus(goal) !== 'COMPLETED'
        );
        const completedGoals = goals.filter(
            (goal) => getNormalizedStatus(goal) === 'COMPLETED'
        );
        const totalSaved = activeGoals.reduce(
            (sum, goal) => sum + goal.currentAmount,
            0
        );
        const totalTarget = activeGoals.reduce(
            (sum, goal) => sum + goal.targetAmount,
            0
        );
        const overallProgress =
            totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

        return {
            totalSaved,
            totalTarget,
            activeGoals: activeGoals.length,
            completedGoals: completedGoals.length,
            overallProgress,
        };
    }, [goals]);

    // Reset form
    const resetForm = () => {
        setGoalName('');
        setGoalTarget('');
        setFundsToAdd('');
        setCurrentAmountEdit('');
        setSelectedGoal(null);
    };

    // Populate edit form
    useEffect(() => {
        if (selectedGoal) {
            setGoalName(selectedGoal.name);
            setGoalTarget(selectedGoal.targetAmount.toString());
            setCurrentAmountEdit(selectedGoal.currentAmount.toString());
        }
    }, [selectedGoal]);

    // Handlers
    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!goalName.trim() || !goalTarget || parseFloat(goalTarget) <= 0) {
            toast.error('Por favor, preencha todos os campos corretamente');
            return;
        }

        createGoal.mutate(
            {
                name: goalName.trim(),
                targetAmount: parseFloat(goalTarget),
            },
            {
                onSuccess: () => {
                    setAddGoalModalOpen(false);
                    resetForm();
                },
            }
        );
    };

    const handleUpdateGoal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !selectedGoal ||
            !goalName.trim() ||
            !goalTarget ||
            parseFloat(goalTarget) <= 0 ||
            parseFloat(currentAmountEdit) < 0
        ) {
            toast.error('Por favor, preencha todos os campos corretamente');
            return;
        }

        const previousStatus = selectedGoal.statusLabel;

        updateGoal.mutate(
            {
                goalId: selectedGoal.id,
                updates: {
                    name: goalName.trim(),
                    targetAmount: parseFloat(goalTarget),
                    currentAmount: parseFloat(currentAmountEdit),
                },
            },
            {
                onSuccess: (data) => {
                    setIsEditModalOpen(false);
                    resetForm();

                    const justCompleted =
                        previousStatus !== 'COMPLETED' &&
                        data.updatedGoal.statusLabel === 'COMPLETED';

                    if (justCompleted) {
                        setCelebrationModalOpen(true);
                    }
                },
            }
        );
    };

    const handleDeleteGoal = async () => {
        if (!selectedGoal) return;

        deleteGoal.mutate(selectedGoal.id, {
            onSuccess: () => {
                setConfirmDeleteModalOpen(false);
                resetForm();
            },
        });
    };

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedGoal || !fundsToAdd || parseFloat(fundsToAdd) <= 0) {
            toast.error('Por favor, insira um valor válido');
            return;
        }

        const amountToAdd = parseFloat(fundsToAdd);
        const newAmount = selectedGoal.currentAmount + amountToAdd;
        const previousStatus = selectedGoal.statusLabel;

        updateGoal.mutate(
            {
                goalId: selectedGoal.id,
                updates: {
                    currentAmount: newAmount,
                },
            },
            {
                onSuccess: (data) => {
                    setAddFundsModalOpen(false);
                    resetForm();

                    const justCompleted =
                        previousStatus !== 'COMPLETED' &&
                        data.updatedGoal.statusLabel === 'COMPLETED';

                    if (justCompleted) {
                        setCelebrationModalOpen(true);
                    }
                },
            }
        );
    };

    // Openers
    const openAddFundsModal = (goal: GoalDTO) => {
        setSelectedGoal(goal);
        setAddFundsModalOpen(true);
    };

    const openEditModal = (goal: GoalDTO) => {
        setSelectedGoal(goal);
        setIsEditModalOpen(true);
    };

    const openConfirmDeleteModal = (goal: GoalDTO) => {
        setSelectedGoal(goal);
        setConfirmDeleteModalOpen(true);
    };

    const openAddGoalModal = () => {
        resetForm();
        setAddGoalModalOpen(true);
    };

    const getFilterLabel = (filter: FilterType) => {
        switch (filter) {
            case 'all':
                return `Todas (${goals.length})`;
            case 'IN_PROGRESS':
                return `Em Andamento (${stats.activeGoals})`;
            case 'COMPLETED':
                return `Concluídas (${stats.completedGoals})`;
            default:
                return 'Todas';
        }
    };

    return {
        goals,
        isLoading,
        createGoal,
        updateGoal,
        deleteGoal,
        activeFilter,
        setActiveFilter,
        isAddGoalModalOpen,
        setAddGoalModalOpen,
        isAddFundsModalOpen,
        setAddFundsModalOpen,
        isCelebrationModalOpen,
        setCelebrationModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isConfirmDeleteModalOpen,
        setConfirmDeleteModalOpen,
        selectedGoal,
        goalName,
        setGoalName,
        goalTarget,
        setGoalTarget,
        fundsToAdd,
        setFundsToAdd,
        currentAmountEdit,
        setCurrentAmountEdit,
        filteredGoals,
        stats,
        handleCreateGoal,
        handleUpdateGoal,
        handleDeleteGoal,
        handleAddFunds,
        openAddFundsModal,
        openEditModal,
        openConfirmDeleteModal,
        openAddGoalModal,
        getFilterLabel,
        getNormalizedStatus,
    };
};
