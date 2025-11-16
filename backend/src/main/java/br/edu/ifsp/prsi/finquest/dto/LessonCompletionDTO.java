package br.edu.ifsp.prsi.finquest.dto;

public record LessonCompletionDTO(
        int awardedFinPoints,
        int totalFinPoints,
        int level,
        boolean didLevelUp,
        int courseProgress,
        AchievementDTO unlockedBadge
) {}
