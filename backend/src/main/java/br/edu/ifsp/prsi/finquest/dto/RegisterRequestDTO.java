package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.annotation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Email inválido")
        @Size(max = 255, message = "O email deve ter no máximo 255 caracteres")
        String email,

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
        String name,

        @NotBlank(message = "A senha é obrigatória")
        @StrongPassword
        String password
) {}
