package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.GoalDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterGoalDTO;

import java.math.BigDecimal;
import java.util.List;

public interface GoalService {
    GoalDTO createGoal(String userId, RegisterGoalDTO request);
    GoalDTO updateGoal(String userId, String goalId, RegisterGoalDTO request);
    GoalDTO findById(String goalId);
    GoalDTO depositAmount(String goalId, BigDecimal amount);
    List<GoalDTO> getUserGoals(String userId);
    GoalDTO deleteGoal(String userId, String goalId);
}
