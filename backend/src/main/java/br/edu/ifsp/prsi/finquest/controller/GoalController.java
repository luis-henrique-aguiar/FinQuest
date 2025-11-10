package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.GoalDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterGoalDTO;
import br.edu.ifsp.prsi.finquest.model.Goal;
import br.edu.ifsp.prsi.finquest.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
}
