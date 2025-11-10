package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.User;

import java.math.BigDecimal;
import java.util.Optional;

public record UserDTO(
        String id,
        String name,
        String email,
        Integer totalFinPoints,
        BigDecimal budget,
        String avatarUrl,
        Integer level
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
        user.setTotalFinPoints(Optional.ofNullable(userDTO.totalFinPoints()).orElse(0));
        user.setBudget(userDTO.budget() != null ? userDTO.budget() : BigDecimal.ZERO);
        user.setAvatarUrl(userDTO.avatarUrl() != null ? userDTO.avatarUrl() : DEFAULT_AVATAR_URL);
        user.setLevel(userDTO.level());

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
                user.getTotalFinPoints(),
                user.getBudget(),
                user.getAvatarUrl(),
                user.getLevel()
        );
    }
}
