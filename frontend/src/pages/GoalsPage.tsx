import React, { useEffect, useState, useMemo } from "react";
import Button from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import { GoalCard } from "../components/gamification/GoalCard";
import * as S from "./GoalsPage.styles";
import api from "../services/api";
import { getAllGoals, type GoalCompletionDTO, type GoalDTO, type GoalUpdateResponseDTO } from "../services/goalService";
import { useAuth } from "../hooks/useAuth";
import { useGamification } from "../context/GamificationContext";
import { Award, Target, TrendingUp, CheckCircle } from "react-feather";

type FilterType = 'all' | 'IN_PROGRESS' | 'COMPLETED';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { addToast } = useToast();
  const { updateUserContext } = useAuth();
  const { showLevelUp, showBadgeUnlocked } = useGamification();

  // Estados dos modais
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [isAddFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [isCelebrationModalOpen, setCelebrationModalOpen] = useState(false);
  const [isLevelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  // Estados para gerenciar a meta selecionada
  const [selectedGoal, setSelectedGoal] = useState<GoalDTO | null>(null);
  const [levelUpInfo] = useState<GoalCompletionDTO | null>(null);

  // Estados para os formulários
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [fundsToAdd, setFundsToAdd] = useState("");
  const [currentAmountEdit, setCurrentAmountEdit] = useState("");

  // Carregar metas ao montar o componente
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const goals = await getAllGoals();
      console.log('Dados recebidos do backend:', goals);
      setGoals(goals);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      addToast('Erro ao carregar suas metas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGoals = useMemo(() => {
      switch (activeFilter) {
        case 'IN_PROGRESS':
          return goals.filter(goal => goal.statusLabel === 'IN_PROGRESS');

        case 'COMPLETED':
          return goals.filter(goal => goal.statusLabel === 'COMPLETED');

        default:
          return goals;
      }
    }, [goals, activeFilter]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const activeGoals = goals.filter(goal => goal.completionPercentage !== '100%');
    const completedGoals = goals.filter(goal => goal.completionPercentage === '100%');
    const totalSaved = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalTarget = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
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
      setGoalTarget(selectedGoal.targetAmount.toString());
      setCurrentAmountEdit(selectedGoal.currentAmount.toString());
    }
  }, [selectedGoal]);

  const resetForm = () => {
    setGoalName("");
    setGoalTarget("");
    setFundsToAdd("");
    setSelectedGoal(null);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    /*if (!goalName.trim() || !goalTarget || parseFloat(goalTarget) <= 0) {
      addToast("Por favor, preencha todos os campos corretamente", "error");
      return;
    }*/

    try {
      const response = await api.post('/goals', {
        name: goalName.trim(),
        targetAmount: parseFloat(goalTarget),
      });

      setGoals((prev) => [...prev, response.data]);
      setAddGoalModalOpen(false);
      resetForm();
      addToast("Nova meta criada com sucesso!", "success");
    } catch (error) {
        if (error?.response?.data?.details) {
            addToast(`${error.response.data.details[0]}`, "error");
        } else {
            console.error('Erro ao criar meta:', error);
            addToast("Erro ao criar meta. Tente novamente.", "error");
        }
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    /*if (!selectedGoal || !goalName.trim() || !goalTarget || parseFloat(goalTarget) <= 0 || parseFloat(currentAmountEdit) < 0) {
      addToast("Por favor, preencha todos os campos corretamente", "error");
      return;
    }*/

    try {
      const previousStatus = selectedGoal.statusLabel;

      const response = await api.put(`/goals/${selectedGoal.id}`, {
        name: goalName.trim(),
        targetAmount: parseFloat(goalTarget),
        currentAmount: parseFloat(currentAmountEdit),
      });

      const { updatedGoal, missionCompletion } = response.data;

      setGoals((prev) =>
          prev.map((g) =>
            g.id === selectedGoal.id
              ? { ...g, ...updatedGoal }
              : g
          )
      );

      setIsEditModalOpen(false);
      resetForm();

      const justCompleted = previousStatus !== 'COMPLETED' && updatedGoal.statusLabel === 'COMPLETED';

      if (justCompleted) {
        setCelebrationModalOpen(true);
      } else {
        addToast("Meta atualizada com sucesso!", "success");
      }

      if (missionCompletion) {
          updateUserContext({
            totalFinPoints: missionCompletion.totalFinPoints,
            level: missionCompletion.level,
          });

          if (missionCompletion.didLevelUp && missionCompletion.unlockedBadge) {
            showBadgeUnlocked(
              missionCompletion.unlockedBadge,
              missionCompletion.level,
              missionCompletion.totalFinPoints,
            );
          } else if (missionCompletion.didLevelUp) {
            showLevelUp(missionCompletion.level);
          }
      }
    } catch (error) {
        if (error?.response?.data?.details) {
            addToast(`${error.response.data.details[0]}`, "error");
        } else {
            console.error('Erro ao atualizar meta:', error);
            addToast("Erro ao atualizar meta. Tente novamente.", "error");
        }
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;

    try {
      await api.delete(`/goals/${selectedGoal.id}`);

      setGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id));
      setConfirmDeleteModalOpen(false);
      resetForm();
      addToast("Meta excluída com sucesso", "success");
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      addToast("Erro ao excluir meta. Tente novamente.", "error");
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGoal || !fundsToAdd || parseFloat(fundsToAdd) <= 0) {
      addToast("Por favor, insira um valor válido", "error");
      return;
    }

    try {
      const amountToAdd = parseFloat(fundsToAdd);
      const response = await api.put<GoalUpdateResponseDTO>(
        `/goals/${selectedGoal.id}/deposit`,
        { amount: amountToAdd }
      );

      const { updatedGoal, missionCompletion } = response.data;

      setGoals((prev) =>
        prev.map((goal) => goal.id === selectedGoal.id ? updatedGoal : goal)
      );

      setAddFundsModalOpen(false);
      resetForm();

      const previousStatus = selectedGoal.statusLabel;
      const justCompleted = previousStatus !== 'COMPLETED' && updatedGoal.statusLabel === 'COMPLETED';

      if (justCompleted) {
        setCelebrationModalOpen(true);
      } else {
        addToast("Valor adicionado com sucesso!", "success");
      }

      if (missionCompletion) {
          updateUserContext({
            totalFinPoints: missionCompletion.totalFinPoints,
            level: missionCompletion.level,
          });

          if (missionCompletion.didLevelUp && missionCompletion.unlockedBadge) {
            showBadgeUnlocked(
              missionCompletion.unlockedBadge,
              missionCompletion.level,
              missionCompletion.totalFinPoints
            );
          } else if (missionCompletion.didLevelUp) {
            showLevelUp(missionCompletion.level);
          }
      }
    } catch (error) {
        if (error?.response?.data?.details) {
            addToast(`${error.response.data.details[0]}`, "error");
        } else {
            addToast("Erro ao adicionar fundos. Tente novamente.", "error");
        }
    }
  };

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
      case 'all': return `Todas (${goals.length})`;
      case 'IN_PROGRESS': return `Em Andamento (${stats.activeGoals})`;
      case 'COMPLETED': return `Concluídas (${stats.completedGoals})`;
      default: return 'Todas';
    }
  };

  const getEmptyStateMessage = (filter: FilterType) => {
    switch (filter) {
      case 'IN_PROGRESS':
        return {
          title: 'Nenhuma meta em andamento',
          description: 'Que tal criar uma nova meta financeira para começar a economizar?'
        };
      case 'COMPLETED':
        return {
          title: 'Nenhuma meta concluída ainda',
          description: 'Continue trabalhando em suas metas ativas para vê-las aqui!'
        };
      default:
        return {
          title: 'Nenhuma meta criada ainda',
          description: 'Que tal definir sua primeira meta financeira? Comece pequeno e vá conquistando seus objetivos!'
        };
    }
  };

  const emptyState = getEmptyStateMessage(activeFilter);

  // Loading state
  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando suas metas...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      {/* Modais... (mantidos iguais) */}
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
                placeholder="Ex: 5000.00"
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

            <S.InputGroup>
              <S.Label htmlFor="editCurrentAmount">Valor Atual (R$)</S.Label>
              <S.Input
                id="editCurrentAmount"
                type="number"
                placeholder="Valor Atual"
                value={currentAmountEdit}
                onChange={(e) => setCurrentAmountEdit(e.target.value)}
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
            Você tem certeza que deseja excluir a meta &quot;<strong>{selectedGoal?.name}</strong>&quot;?
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
        title="Adicionar Dinheiro"
      >
        <S.ModalContent>
          <S.ModalDescription>
            Adicione dinheiro à meta &quot;<strong>{selectedGoal?.name}</strong>&quot;.
          </S.ModalDescription>

          <S.FormContainer onSubmit={handleAddFunds}>
            <S.InputGroup>
              <S.Label htmlFor="fundsAmount">Valor a Adicionar (R$)</S.Label>
              <S.Input
                id="fundsAmount"
                type="number"
                placeholder="Ex: 100.00"
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

      {/* Modal de Level Up */}
      <Modal
        isOpen={isLevelUpModalOpen}
        onClose={() => setLevelUpModalOpen(false)}
        title=""
      >
        <S.CelebrationContainer>
          <S.LottieContainer>
            🎊
          </S.LottieContainer>
          <h2>SUBIU DE NÍVEL!</h2>
          <p>Você chegou ao <strong>Nível {levelUpInfo?.level}</strong>!</p>
          <p>Total de FinPoints: <strong>{levelUpInfo?.totalFinPoints}</strong></p>

          {levelUpInfo?.unlockedBadge && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {levelUpInfo.unlockedBadge.icon}
              </div>
              <h3>Badge Desbloqueado!</h3>
              <p><strong>{levelUpInfo.unlockedBadge.title}</strong></p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {levelUpInfo.unlockedBadge.description}
              </p>
            </div>
          )}

          <Button onClick={() => setLevelUpModalOpen(false)} style={{ marginTop: '20px' }}>
            Continuar
          </Button>
        </S.CelebrationContainer>
      </Modal>

      <S.Header>
        <S.Title>
          <Award size={32} />
          Minhas Metas Financeiras
        </S.Title>
        <S.Subtitle>
          Defina objetivos, economize e conquiste suas metas financeiras!
        </S.Subtitle>
      </S.Header>

      {/* STATS CARDS */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatIcon color="#007ACC">
            <Target size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{goals.length}</S.StatValue>
            <S.StatLabel>Total de Metas</S.StatLabel>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon color="#FFA500">
            <TrendingUp size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.activeGoals}</S.StatValue>
            <S.StatLabel>Em Andamento</S.StatLabel>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatIcon color="#28A745">
            <CheckCircle size={24} />
          </S.StatIcon>
          <S.StatContent>
            <S.StatValue>{stats.completedGoals}</S.StatValue>
            <S.StatLabel>Concluídas</S.StatLabel>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      {/* BOTÃO DE NOVA META */}
      <S.ActionButtonContainer>
        <Button
          variant="primary"
          onClick={openAddGoalModal}
        >
          + Nova Meta
        </Button>
      </S.ActionButtonContainer>

      {/* FILTROS */}
      <S.FilterTabs>
        {(['all', 'IN_PROGRESS', 'COMPLETED'] as FilterType[]).map((filter) => (
          <S.FilterTab
            key={filter}
            $active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {getFilterLabel(filter)}
          </S.FilterTab>
        ))}
      </S.FilterTabs>

      {/* GRID DE METAS */}
      {filteredGoals.length > 0 ? (
        <S.GoalsGrid>
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.name}
              target={goal.targetAmount}
              saved={goal.currentAmount}
              status={goal.statusLabel}
              onAddFunds={() => openAddFundsModal(goal)}
              onEdit={() => openEditModal(goal)}
              onDelete={() => openConfirmDeleteModal(goal)}
            />
          ))}
        </S.GoalsGrid>
      ) : (
        <S.EmptyState>
          <Target size={64} />
          <h3>{emptyState.title}</h3>
          <p>{emptyState.description}</p>
        </S.EmptyState>
      )}
    </S.PageContainer>
  );
};

export default GoalsPage;