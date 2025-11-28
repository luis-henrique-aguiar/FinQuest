package br.edu.ifsp.prsi.finquest.dto;

import java.time.LocalDateTime;

public record AchievementStatusDTO(
        Long id,
        String title,
        String description,
        String icon,
        Integer requiredLevel,
        boolean isUnlocked
) {}
