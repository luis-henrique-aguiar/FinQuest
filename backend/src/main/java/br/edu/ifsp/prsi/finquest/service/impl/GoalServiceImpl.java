package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.GoalRepository;
import br.edu.ifsp.prsi.finquest.service.GoalService;
import br.edu.ifsp.prsi.finquest.model.enums.GoalStatus;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class GoalServiceImpl implements GoalService {

    private static final Logger logger = LoggerFactory.getLogger(GoalServiceImpl.class);

    private final GoalRepository goalRepository;
    private final MissionServiceImpl missionService;

    public GoalServiceImpl(
            GoalRepository goalRepository,
            MissionServiceImpl missionService
    ) {
        this.goalRepository = goalRepository;
        this.missionService = missionService;
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

        Goal savedGoal = goalRepository.save(newGoal);
        return GoalDTO.fromEntity(savedGoal);
    }

    @Override
    @Transactional
    public GoalUpdateResponseDTO updateGoal(String userId, String goalId, UpdateGoalDTO request) {
        Goal goal = findGoalAndValidateUser(userId, goalId);

        goal.setName(request.name());
        goal.setTargetAmount(request.targetAmount());
        goal.setCurrentAmount(request.currentAmount());

        GoalStatus oldStatus = goal.getStatus();

        determineGoalStatus(goal);

        Goal updatedGoalEntity = goalRepository.save(goal);
        GoalCompletionDTO completionDto = handleGoalCompletionEvent(updatedGoalEntity, oldStatus);

        GoalDTO updatedGoalDto = GoalDTO.fromEntity(updatedGoalEntity);

        return new GoalUpdateResponseDTO(updatedGoalDto, completionDto);
    }

    @Override
    public GoalDTO findById(String userId, String goalId) {
        Goal goalEntity = findGoalAndValidateUser(userId, goalId);
        return GoalDTO.fromEntity(goalEntity);
    }

    @Override
    @Transactional
    public GoalUpdateResponseDTO depositAmount(String userId, String goalId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("O valor do depósito deve ser maior que zero.");
        }

        Goal goal = findGoalAndValidateUser(userId, goalId);
        GoalStatus oldStatus = goal.getStatus(); // Captura o status ANTERIOR

        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        determineGoalStatus(goal);

        Goal updatedGoalEntity = goalRepository.save(goal);
        GoalCompletionDTO completionDto = handleGoalCompletionEvent(updatedGoalEntity, oldStatus);
        GoalDTO updatedGoalDto = GoalDTO.fromEntity(updatedGoalEntity);

        return new GoalUpdateResponseDTO(updatedGoalDto, completionDto);
    }

    @Override
    @Transactional
    public GoalDTO deleteGoal(String userId, String goalId) {
        Goal goal = findGoalAndValidateUser(userId, goalId);
        goalRepository.delete(goal);

        return GoalDTO.fromEntity(goal);
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
                .toList();
    }

    private void determineGoalStatus(Goal goal) {
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(GoalStatus.COMPLETED);
        } else {
            goal.setStatus(GoalStatus.IN_PROGRESS);
        }
    }

    private GoalCompletionDTO handleGoalCompletionEvent(Goal updatedGoalEntity, GoalStatus oldStatus) {
        boolean justCompleted = updatedGoalEntity.getStatus().equals(GoalStatus.COMPLETED)
                && !oldStatus.equals(GoalStatus.COMPLETED);

        if (justCompleted) {
            return missionService.processGoalCompletion(updatedGoalEntity.getUserId(), updatedGoalEntity.getId());
        }

        return null;
    }
}
