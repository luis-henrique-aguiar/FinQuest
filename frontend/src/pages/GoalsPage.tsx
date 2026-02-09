import React from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/common/Modal'; // Using the refactored Modal wrapper
import { GoalCard } from '@/features/gamification/components/GoalCard';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, Target, TrendingUp, CheckCircle, Plus } from 'lucide-react';
import { useGoalsLogic, type FilterType } from '@/features/finance/hooks/useGoalsLogic';

export const GoalsPage: React.FC = () => {
  const {
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
  } = useGoalsLogic();

  const emptyState = {
    title: 'Nenhuma meta encontrada',
    description: 'Crie uma nova meta para começar a acompanhar seu progresso.'
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando suas metas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
          <Award className="text-primary w-8 h-8" />
          Minhas Metas Financeiras
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Defina objetivos, economize e conquiste suas metas financeiras!
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-primary/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{goals.length || 0}</h3>
              <p className="text-sm font-medium text-zinc-500">Total de Metas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-amber-500/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.activeGoals || 0}</h3>
              <p className="text-sm font-medium text-zinc-500">Em Andamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform border-l-4 border-l-green-500/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.completedGoals || 0}</h3>
              <p className="text-sm font-medium text-zinc-500">Concluídas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex p-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto w-full md:w-auto">
          {(['all', 'IN_PROGRESS', 'COMPLETED'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                activeFilter === filter
                  ? "bg-primary text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>

        <Button onClick={openAddGoalModal} className="w-full md:w-auto shadow-md">
          <Plus size={18} className="mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* GOALS GRID */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.name}
              target={goal.targetAmount}
              saved={goal.currentAmount}
              status={getNormalizedStatus(goal)}
              onAddFunds={() => openAddFundsModal(goal)}
              onEdit={() => openEditModal(goal)}
              onDelete={() => openConfirmDeleteModal(goal)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center gap-4">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
            <Target size={40} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{emptyState.title}</h3>
          <p className="text-zinc-500 max-w-sm">{emptyState.description}</p>
          <Button variant="outline" onClick={openAddGoalModal} className="mt-2">
            Criar primeira meta
          </Button>
        </div>
      )}

      {/* CREATE GOAL MODAL */}
      <Modal
        isOpen={isAddGoalModalOpen}
        onClose={() => setAddGoalModalOpen(false)}
        title="Criar Nova Meta"
      >
        <div className="flex flex-col gap-6 p-1">
          <p className="text-zinc-500">
            Defina uma meta financeira e comece a economizar para alcançá-la!
          </p>

          <form onSubmit={handleCreateGoal} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="goalName" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Nome da Meta
              </label>
              <Input
                id="goalName"
                placeholder="Ex: Viagem, Carro novo..."
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="goalTarget" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Valor Alvo (R$)
              </label>
              <Input
                id="goalTarget"
                type="number"
                placeholder="Ex: 5000.00"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setAddGoalModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createGoal.isPending}>
                {createGoal.isPending ? 'Criando...' : 'Criar Meta'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* EDIT GOAL MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Meta"
      >
        <div className="flex flex-col gap-6 p-1">
          <form onSubmit={handleUpdateGoal} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Meta</label>
              <Input
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Alvo (R$)</label>
              <Input
                type="number"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Atual (R$)</label>
              <Input
                type="number"
                value={currentAmountEdit}
                onChange={(e) => setCurrentAmountEdit(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateGoal.isPending}>
                {updateGoal.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ADD FUNDS MODAL */}
      <Modal
        isOpen={isAddFundsModalOpen}
        onClose={() => setAddFundsModalOpen(false)}
        title="Adicionar Dinheiro"
      >
        <div className="flex flex-col gap-6 p-1">
          <p className="text-zinc-500">
            Adicione dinheiro à meta <strong className="text-zinc-900 dark:text-zinc-100">{selectedGoal?.name}</strong>.
          </p>

          <form onSubmit={handleAddFunds} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor a Adicionar (R$)</label>
              <Input
                type="number"
                placeholder="Ex: 100.00"
                value={fundsToAdd}
                onChange={(e) => setFundsToAdd(e.target.value)}
                min="0"
                step="0.01"
                required
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setAddFundsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateGoal.isPending}>
                {updateGoal.isPending ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-6 p-1">
          <p className="text-zinc-600 dark:text-zinc-400">
            Você tem certeza que deseja excluir a meta <strong className="text-zinc-900 dark:text-zinc-100">{selectedGoal?.name}</strong>?
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setConfirmDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGoal}
              disabled={deleteGoal.isPending}
            >
              {deleteGoal.isPending ? 'Excluindo...' : 'Sim, Excluir'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* CELEBRATION MODAL */}
      <Modal
        isOpen={isCelebrationModalOpen}
        onClose={() => setCelebrationModalOpen(false)}
        title=""
      >
        <div className="flex flex-col items-center text-center gap-6 p-6">
          <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-6xl animate-bounce">
            🏆
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-600">Parabéns!</h2>
            <p className="text-zinc-600">
              Você alcançou sua meta financeira! Continue assim e conquiste ainda mais objetivos!
            </p>
          </div>
          <Button onClick={() => setCelebrationModalOpen(false)} size="lg" className="w-full">
            Continuar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GoalsPage;