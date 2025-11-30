package br.edu.ifsp.prsi.finquest.dto;

public record AchievementStatusDTO(
        Long id,
        String title,
        String description,
        String icon,
        Integer requiredLevel,
        boolean isUnlocked
) {}
