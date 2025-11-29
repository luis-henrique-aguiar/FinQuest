package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface GoalService {

    GoalDTO createGoal(String userId, RegisterGoalDTO request);

    GoalUpdateResponseDTO updateGoal(String userId, String goalId, UpdateGoalDTO request);

    GoalDTO findById(String userId, String goalId);

    GoalUpdateResponseDTO depositAmount(String userId, String goalId, BigDecimal amount);

    GoalDTO deleteGoal(String userId, String goalId);

    List<GoalDTO> getAllUserGoals(String userId);

    List<GoalDTO> getCompletedGoals(String userId);

    List<GoalDTO> getInProgressGoals(String userId);

}
