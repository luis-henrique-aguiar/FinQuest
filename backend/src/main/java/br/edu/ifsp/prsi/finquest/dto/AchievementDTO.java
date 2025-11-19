package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Achievement;

public record AchievementDTO(
        Long id,
        String title,
        String description,
        String icon,
        int requiredLevel
) {
    public AchievementDTO(Achievement achievement) {
        this(
                achievement.getId(),
                achievement.getTitle(),
                achievement.getDescription(),
                achievement.getIcon(),
                achievement.getRequiredLevel()
        );
    }
}
