import React, { useEffect, useState, useMemo } from "react";
import { PlusCircle } from "react-feather";
import Button from "../components/common/Button";
import SectionTitle from "../components/common/SectionTitle";
import { Modal } from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import { GoalCard } from "../components/gamification/GoalCard";
import * as S from "./GoalsPage.styles";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  completedAt?: string;
}

type FilterType = 'all' | 'active' | 'completed' | 'archived';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    // Dados mockados para demonstração
    {
      id: '1',
      name: 'Viagem para Europa',
      target: 15000,
      saved: 8500,
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Fundo de Emergência',
      target: 10000,
      saved: 10000,
      status: 'completed',
      createdAt: '2024-01-10',
      completedAt: '2024-02-15',
    },
    {
      id: '3',
      name: 'Novo Notebook',
      target: 3500,
      saved: 1200,
      status: 'active',
      createdAt: '2024-02-01',
    },
    {
      id: '4',
      name: 'Curso de Especialização',
      target: 2500,
      saved: 800,
      status: 'active',
      createdAt: '2024-02-10',
    },
    {
      id: '5',
      name: 'Carro Usado',
      target: 25000,
      saved: 25000,
      status: 'archived',
      createdAt: '2023-06-01',
      completedAt: '2023-12-15',
    },
    {
      id: '6',
      name: 'Intercâmbio',
      target: 20000,
      saved: 20000,
      status: 'completed',
      createdAt: '2023-08-01',
      completedAt: '2024-01-20',
    },
  ]);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { addToast } = useToast();

  // Estados dos modais
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [isAddFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [isCelebrationModalOpen, setCelebrationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  // Estados para gerenciar a meta selecionada
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Estados para os formulários
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [fundsToAdd, setFundsToAdd] = useState("");

  // Filtrar metas baseado no filtro ativo
  const filteredGoals = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return goals.filter(goal => goal.status === 'active');
      case 'completed':
        return goals.filter(goal => goal.status === 'completed');
      case 'archived':
        return goals.filter(goal => goal.status === 'archived');
      default:
        return goals.filter(goal => goal.status !== 'archived'); // Mostra active e completed
    }
  }, [goals, activeFilter]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const activeGoals = goals.filter(goal => goal.status === 'active');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    const totalSaved = activeGoals.reduce((sum, goal) => sum + goal.saved, 0);
    const totalTarget = activeGoals.reduce((sum, goal) => sum + goal.target, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return {
      totalSaved,
      totalTarget,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      overallProgress,
    };
  }, [goals]);

  // Efeito para preencher o formulário de edição quando selectedGoal muda
  useEffect(() => {
    if (selectedGoal) {
      setGoalName(selectedGoal.name);
      setGoalTarget(selectedGoal.target.toString());
    }
  }, [selectedGoal]);

  const resetForm = () => {
    setGoalName("");
    setGoalTarget("");
    setFundsToAdd("");
    setSelectedGoal(null);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalName.trim() || !goalTarget || parseFloat(goalTarget) <= 0) {
      addToast("Por favor, preencha todos os campos corretamente", "error");
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName.trim(),
      target: parseFloat(goalTarget),
      saved: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) => [...prev, newGoal]);
    setAddGoalModalOpen(false);
    resetForm();
    addToast("Nova meta criada com sucesso!", "success");
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGoal || !goalName.trim() || !goalTarget || parseFloat(goalTarget) <= 0) {
      addToast("Por favor, preencha todos os campos corretamente", "error");
      return;
    }

    const updatedTarget = parseFloat(goalTarget);
    
    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, name: goalName.trim(), target: updatedTarget }
          : g
      )
    );

    setIsEditModalOpen(false);
    resetForm();
    addToast("Meta atualizada com sucesso!", "success");
  };

  const handleDeleteGoal = () => {
    if (!selectedGoal) return;

    setGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id));
    setConfirmDeleteModalOpen(false);
    resetForm();
    addToast("Meta excluída com sucesso", "success");
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGoal || !fundsToAdd || parseFloat(fundsToAdd) <= 0) {
      addToast("Por favor, insira um valor válido", "error");
      return;
    }

    const amountToAdd = parseFloat(fundsToAdd);
    let wasCompleted = false;

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === selectedGoal.id) {
          const newSaved = goal.saved + amountToAdd;
          const shouldComplete = newSaved >= goal.target && goal.saved < goal.target;
          
          if (shouldComplete) {
            wasCompleted = true;
          }

          return { 
            ...goal, 
            saved: newSaved,
            status: shouldComplete ? 'completed' : goal.status,
            completedAt: shouldComplete ? new Date().toISOString() : goal.completedAt,
          };
        }
        return goal;
      })
    );

    setAddFundsModalOpen(false);
    resetForm();
    
    if (wasCompleted) {
      setCelebrationModalOpen(true);
      addToast("🎉 Parabéns! Você concluiu sua meta!", "success");
    } else {
      addToast("Valor adicionado com sucesso!", "success");
    }
  };

  const openAddFundsModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setAddFundsModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const openConfirmDeleteModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setConfirmDeleteModalOpen(true);
  };

  const openAddGoalModal = () => {
    resetForm();
    setAddGoalModalOpen(true);
  };

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'Todas';
      case 'active': return 'Em Andamento';
      case 'completed': return 'Concluídas';
      case 'archived': return 'Histórico';
      default: return 'Todas';
    }
  };

  const getEmptyStateMessage = (filter: FilterType) => {
    switch (filter) {
      case 'active':
        return {
          title: 'Nenhuma meta em andamento',
          description: 'Que tal criar uma nova meta financeira para começar a economizar?'
        };
      case 'completed':
        return {
          title: 'Nenhuma meta concluída ainda',
          description: 'Continue trabalhando em suas metas ativas para vê-las aqui!'
        };
      case 'archived':
        return {
          title: 'Nenhuma meta no histórico',
          description: 'Metas antigas e arquivadas aparecerão aqui.'
        };
      default:
        return {
          title: 'Nenhuma meta criada ainda',
          description: 'Que tal definir sua primeira meta financeira? Comece pequeno e vá conquistando seus objetivos!'
        };
    }
  };

  const emptyState = getEmptyStateMessage(activeFilter);

  return (
    <S.PageContainer>
      {/* Modal de Criar Meta */}
      <Modal
        isOpen={isAddGoalModalOpen}
        onClose={() => setAddGoalModalOpen(false)}
        title="Criar Nova Meta"
      >
        <S.ModalContent>
          <S.ModalDescription>
            Defina uma meta financeira e comece a economizar para alcançá-la!
          </S.ModalDescription>
          
          <S.FormContainer onSubmit={handleCreateGoal}>
            <S.InputGroup>
              <S.Label htmlFor="goalName">Nome da Meta</S.Label>
              <S.Input
                id="goalName"
                type="text"
                placeholder="Ex: Viagem, Carro novo, Fundo de emergência..."
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="goalTarget">Valor Alvo (R$)</S.Label>
              <S.Input
                id="goalTarget"
                type="number"
                placeholder="Ex: 5000,00"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </S.InputGroup>

            <S.ModalButtonContainer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddGoalModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Criar Meta
              </Button>
            </S.ModalButtonContainer>
          </S.FormContainer>
        </S.ModalContent>
      </Modal>

      {/* Modal de Editar Meta */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Meta"
      >
        <S.ModalContent>
          <S.ModalDescription>
            Edite as informações da sua meta financeira.
          </S.ModalDescription>
          
          <S.FormContainer onSubmit={handleUpdateGoal}>
            <S.InputGroup>
              <S.Label htmlFor="editGoalName">Nome da Meta</S.Label>
              <S.Input
                id="editGoalName"
                type="text"
                placeholder="Nome da Meta"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="editGoalTarget">Valor Alvo (R$)</S.Label>
              <S.Input
                id="editGoalTarget"
                type="number"
                placeholder="Valor Alvo"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </S.InputGroup>

            <S.ModalButtonContainer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar Alterações
              </Button>
            </S.ModalButtonContainer>
          </S.FormContainer>
        </S.ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <S.ModalContent>
          <p>
            Você tem certeza que deseja excluir a meta "<strong>{selectedGoal?.name}</strong>"?
          </p>
          <S.ModalDescription>
            Esta ação não pode ser desfeita e todo o progresso será perdido.
          </S.ModalDescription>

          <S.ModalButtonContainer>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              style={{ backgroundColor: "#DC3545" }}
              onClick={handleDeleteGoal}
            >
              Sim, Excluir
            </Button>
          </S.ModalButtonContainer>
        </S.ModalContent>
      </Modal>

      {/* Modal de Adicionar Fundos */}
      <Modal
        isOpen={isAddFundsModalOpen}
        onClose={() => setAddFundsModalOpen(false)}
        title={`Adicionar Dinheiro`}
      >
        <S.ModalContent>
          <S.ModalDescription>
            Adicione dinheiro à meta "<strong>{selectedGoal?.name}</strong>".
          </S.ModalDescription>
          
          <S.FormContainer onSubmit={handleAddFunds}>
            <S.InputGroup>
              <S.Label htmlFor="fundsAmount">Valor a Adicionar (R$)</S.Label>
              <S.Input
                id="fundsAmount"
                type="number"
                placeholder="Ex: 100,00"
                value={fundsToAdd}
                onChange={(e) => setFundsToAdd(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </S.InputGroup>

            <S.ModalButtonContainer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddFundsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Adicionar
              </Button>
            </S.ModalButtonContainer>
          </S.FormContainer>
        </S.ModalContent>
      </Modal>

      {/* Modal de Celebração */}
      <Modal
        isOpen={isCelebrationModalOpen}
        onClose={() => setCelebrationModalOpen(false)}
        title=""
      >
        <S.CelebrationContainer>
          <S.LottieContainer>
            🏆
          </S.LottieContainer>
          <h2>Parabéns!</h2>
          <p>Você alcançou sua meta financeira! Continue assim e conquiste ainda mais objetivos!</p>
          <Button onClick={() => setCelebrationModalOpen(false)}>
            Continuar
          </Button>
        </S.CelebrationContainer>
      </Modal>

      {/* Conteúdo da Página */}
      <S.Header>
        <SectionTitle>Minhas Metas Financeiras</SectionTitle>
        <Button
          variant="primary"
          onClick={openAddGoalModal}
          icon={<PlusCircle size={18} />}
        >
          Nova Meta
        </Button>
      </S.Header>

      {/* Estatísticas - apenas para metas ativas */}
      {stats.activeGoals > 0 && (
        <S.StatsContainer>
          <S.StatCard>
            <div className="stat-value">{formatCurrency(stats.totalSaved)}</div>
            <div className="stat-label">Total Economizado</div>
          </S.StatCard>
          <S.StatCard>
            <div className="stat-value">{stats.activeGoals}</div>
            <div className="stat-label">Metas Ativas</div>
          </S.StatCard>
          <S.StatCard>
            <div className="stat-value">{stats.overallProgress.toFixed(0)}%</div>
            <div className="stat-label">Progresso Geral</div>
          </S.StatCard>
        </S.StatsContainer>
      )}

      {/* Filtros */}
      <S.FilterSection>
        <S.FilterTabs>
          {(['all', 'active', 'completed', 'archived'] as FilterType[]).map((filter) => (
            <S.FilterTab
              key={filter}
              $active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {getFilterLabel(filter)}
            </S.FilterTab>
          ))}
        </S.FilterTabs>
        
        {filteredGoals.length > 0 && (
          <S.FilterInfo>
            <S.ResultCount>
              {filteredGoals.length} {filteredGoals.length === 1 ? 'meta encontrada' : 'metas encontradas'}
            </S.ResultCount>
            {activeFilter !== 'all' && (
              <S.ClearFilters onClick={() => setActiveFilter('all')}>
                Limpar filtros
              </S.ClearFilters>
            )}
          </S.FilterInfo>
        )}
      </S.FilterSection>

      {/* Grid de Metas */}
      {filteredGoals.length > 0 ? (
        <S.GoalsGrid>
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              {...goal}
              onAddFunds={() => openAddFundsModal(goal)}
              onEdit={() => openEditModal(goal)}
              onDelete={() => openConfirmDeleteModal(goal)}
            />
          ))}
        </S.GoalsGrid>
      ) : (
        <S.EmptyState>
          <span className="emoji">🎯</span>
          <h3>{emptyState.title}</h3>
          <p>{emptyState.description}</p>
        </S.EmptyState>
      )}
    </S.PageContainer>
  );
};

export default GoalsPage;