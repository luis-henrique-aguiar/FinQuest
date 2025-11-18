package br.edu.ifsp.prsi.finquest.dto;

public record GoalCompletionDTO(
        int totalFinPoints,
        int level,
        boolean didLevelUp,
        AchievementDTO unlockedBadge
) {}
