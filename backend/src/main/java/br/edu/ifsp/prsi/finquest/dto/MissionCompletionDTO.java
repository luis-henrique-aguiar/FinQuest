package br.edu.ifsp.prsi.finquest.dto;

public record MissionCompletionDTO(
        int totalFinPoints,
        int level,
        boolean didLevelUp,
        AchievementDTO unlockedBadge
) {}
