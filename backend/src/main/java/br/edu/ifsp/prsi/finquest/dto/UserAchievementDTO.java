package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.UserAchievement;

import java.time.LocalDate;

public record UserAchievementDTO(
        Long achievementId,
        String title,
        String icon,
        LocalDate unlockedDate
) {
    public UserAchievementDTO(UserAchievement userAchievement) {
        this(
                userAchievement.getAchievement().getId(),
                userAchievement.getAchievement().getTitle(),
                userAchievement.getAchievement().getIcon(),
                userAchievement.getDate()
        );
    }
}
