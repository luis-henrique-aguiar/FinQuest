package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateAvatarDTO(
        @NotBlank(message = "A URL do avatar é obrigatória")
        String avatarUrl
) {}
