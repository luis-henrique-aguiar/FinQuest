package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserPasswordDTO(
        @NotBlank(message = "A nova senha é obrigatória.")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
        String newPassword,

        @NotBlank(message = "A confirmação da senha é obrigatória.")
        String confirmationPassword
) {}
