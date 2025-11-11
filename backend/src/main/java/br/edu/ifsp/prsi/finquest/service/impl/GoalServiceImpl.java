package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.GoalDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterGoalDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.Goal;
import br.edu.ifsp.prsi.finquest.repository.GoalRepository;
import br.edu.ifsp.prsi.finquest.service.GoalService;
import br.edu.ifsp.prsi.finquest.utils.GoalStatus;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;

    public GoalServiceImpl(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    private Goal findGoalAndValidateUser(String userId, String goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new EntityNotFoundException("Meta não encontrada com ID: " + goalId));

        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException("Acesso negado. Você não é o proprietário desta meta.");
        }
        return goal;
    }

    @Override
    @Transactional
    public GoalDTO createGoal(String userId, RegisterGoalDTO request) {
        Goal newGoal = new Goal();

        newGoal.setId(UUID.randomUUID().toString());

        newGoal.setUserId(userId);
        newGoal.setName(request.name());
        newGoal.setTargetAmount(request.targetAmount());

        newGoal.setCurrentAmount(BigDecimal.ZERO);
        newGoal.setStatus(GoalStatus.IN_PROGRESS);
        newGoal.setXpGenerated(false);

        Goal savedGoal = goalRepository.save(newGoal);
        return GoalDTO.fromEntity(savedGoal);
    }

    @Override
    @Transactional
    public GoalDTO updateGoal(String userId, String goalId, RegisterGoalDTO request) {
        Goal goal = findGoalAndValidateUser(userId, goalId);

        goal.setName(request.name());
        goal.setTargetAmount(request.targetAmount());

        if (goal.getTargetAmount().compareTo(goal.getCurrentAmount()) > 0) {
            if (goal.getStatus().equals(GoalStatus.COMPLETED)) {
                goal.setStatus(GoalStatus.IN_PROGRESS);
            }
        } else {
            if (!goal.getStatus().equals(GoalStatus.COMPLETED)) {
                goal.setStatus(GoalStatus.COMPLETED);
            }
        }

        Goal updatedGoal = goalRepository.save(goal);
        return GoalDTO.fromEntity(updatedGoal);
    }

    @Override
    public GoalDTO findById(String userId, String goalId) {
        Goal goalEntity = findGoalAndValidateUser(userId, goalId);
        return GoalDTO.fromEntity(goalEntity);
    }

    @Override
    @Transactional
    public GoalDTO depositAmount(String userId, String goalId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("O valor do depósito deve ser maior que zero.");
        }

        Goal goal = findGoalAndValidateUser(userId, goalId);
        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {

            // Alterar depois de implementação de missões, para verificar se alguma nova missao foi concluída.
            if (!goal.isXpGenerated()) {
                goal.setXpGenerated(true);
            }

            goal.setStatus(GoalStatus.COMPLETED);
        } else {
            goal.setStatus(GoalStatus.IN_PROGRESS);
        }

        Goal savedGoal = goalRepository.save(goal);
        return GoalDTO.fromEntity(savedGoal);
    }

    @Override
    @Transactional
    public GoalDTO deleteGoal(String userId, String goalId) {
        Goal goal = findGoalAndValidateUser(userId, goalId);
        if (goal.isXpGenerated()) {
            throw new BusinessException("Meta já utilizada para contagem de recompensas (XP) e não pode ser excluída.");
        }
        goalRepository.delete(goal);

        return null;
    }

    @Override
    public List<GoalDTO> getAllUserGoals(String userId) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        return convertToDtoList(goals);
    }

    @Override
    public List<GoalDTO> getCompletedGoals(String userId) {
        List<Goal> goals = goalRepository.findByUserIdAndStatus(userId, GoalStatus.COMPLETED);
        return convertToDtoList(goals);
    }

    @Override
    public List<GoalDTO> getInProgressGoals(String userId) {
        List<Goal> goals = goalRepository.findByUserIdAndStatus(userId, GoalStatus.IN_PROGRESS);
        return convertToDtoList(goals);
    }

    private List<GoalDTO> convertToDtoList(List<Goal> goals) {
        return goals.stream()
                .map(GoalDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
