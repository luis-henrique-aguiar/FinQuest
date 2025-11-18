package br.edu.ifsp.prsi.finquest.dto;

public record AdminStatsDTO(
        long totalUsers,
        long activeUsers,
        long totalLessonsCompleted,
        long totalMissionsCompleted,
        double averageFinPoints,
        int highestLevel
) {}
