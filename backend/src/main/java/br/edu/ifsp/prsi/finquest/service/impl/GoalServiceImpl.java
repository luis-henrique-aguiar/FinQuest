package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.GoalDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterGoalDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.Goal;
import br.edu.ifsp.prsi.finquest.repository.GoalRepository;
import br.edu.ifsp.prsi.finquest.service.GoalService;
import br.edu.ifsp.prsi.finquest.utils.GoalStatus;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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
    public GoalDTO createGoal(String userId, RegisterGoalDTO request) {
        Goal newGoal = new Goal();

        newGoal.setId(UUID.randomUUID().toString());

        newGoal.setUserId(userId);
        newGoal.setName(request.getName());
        newGoal.setTargetAmount(request.getTargetAmount());

        newGoal.setCurrentAmount(BigDecimal.ZERO);
        newGoal.setStatus(GoalStatus.IN_PROGRESS);
        newGoal.setXpGenerated(false);

        Goal savedGoal = goalRepository.save(newGoal);
        return GoalDTO.fromEntity(savedGoal);
    }

    @Override
    public GoalDTO updateGoal(String userId, String goalId, RegisterGoalDTO request) {
        Goal goal = findGoalAndValidateUser(userId, goalId);

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());

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
    public GoalDTO findById(String goalId) {
        Goal goalEntity = goalRepository.findById(goalId).orElseThrow(() -> new EntityNotFoundException("Meta não encontrada com ID: " + goalId));
        return GoalDTO.fromEntity(goalEntity);
    }

    @Override
    public GoalDTO depositAmount(String goalId, BigDecimal amount) {
        return null;
    }

    @Override
    public List<GoalDTO> getUserGoals(String userId) {
        return List.of();
    }

    @Override
    public GoalDTO deleteGoal(String userId, String goalId) {
        return null;
    }
}
