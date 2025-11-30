package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.enums.UserRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record UserDTO(
        String id,
        String name,
        String email,
        LocalDateTime registrationAt,
        Integer totalFinPoints,
        String avatarUrl,
        Integer level,
        UserRole role,
        List<UserAchievementDTO> unlockedAchievements
) {

    private static final String DEFAULT_AVATAR_URL = "default.png";

    public static User convertFromDTO(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        User user = new User();

        user.setId(userDTO.id());
        user.setName(userDTO.name());
        user.setEmail(userDTO.email());
        user.setRegistrationAt(userDTO.registrationAt());
        user.setTotalFinPoints(Optional.ofNullable(userDTO.totalFinPoints()).orElse(0));
        user.setAvatarUrl(userDTO.avatarUrl() != null ? userDTO.avatarUrl() : DEFAULT_AVATAR_URL);
        user.setLevel(userDTO.level());
        user.setRole(userDTO.role());

        return user;
    }

    public static UserDTO convertToDTO(User user) {
        if (user == null) {
            return null;
        }

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRegistrationAt(),
                user.getTotalFinPoints(),
                user.getAvatarUrl(),
                user.getLevel(),
                user.getRole(),
                null
        );
    }

    public static UserDTO convertToDTOWithAchievements(User user, List<UserAchievementDTO> achievements) {
        if (user == null) {
            return null;
        }

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRegistrationAt(),
                user.getTotalFinPoints(),
                user.getAvatarUrl(),
                user.getLevel(),
                user.getRole(),
                achievements
        );
    }
}
