package br.edu.ifsp.prsi.finquest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record GoalUpdateResponseDTO(
        GoalDTO updatedGoal,
        GoalCompletionDTO missionCompletion
) {}
