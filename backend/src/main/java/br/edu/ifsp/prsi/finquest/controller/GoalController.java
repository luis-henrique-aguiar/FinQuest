package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.DepositDTO;
import br.edu.ifsp.prsi.finquest.dto.GoalDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterGoalDTO;
import br.edu.ifsp.prsi.finquest.model.Goal;
import br.edu.ifsp.prsi.finquest.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService){
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody @Valid RegisterGoalDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        GoalDTO responseDto = goalService.createGoal(userId, request);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable("goalId") String idGoal, @RequestBody @Valid RegisterGoalDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        GoalDTO responseDto = goalService.updateGoal(userId, idGoal, request);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{goalId}/deposit")
    public ResponseEntity<GoalDTO> depositAmount(@PathVariable("goalId") String goalId, @RequestBody @Valid DepositDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        GoalDTO responseDto = goalService.depositAmount(userId, goalId, request.amount());
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable("goalId") String goalId, @AuthenticationPrincipal UserDetails userDetails){
        String userId = userDetails.getUsername();
        goalService.deleteGoal(userId, goalId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{goalId}")
    public ResponseEntity<GoalDTO> getGoal(@PathVariable("goalId") String goalId, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(goalService.findById(userId, goalId));
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getAllGoals(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(goalService.getAllUserGoals(userId));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<GoalDTO>> getCompletedGoals(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(goalService.getCompletedGoals(userId));
    }

    @GetMapping("/inprogress")
    public ResponseEntity<List<GoalDTO>> getInProgressGoals(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(goalService.getInProgressGoals(userId));
    }
}
