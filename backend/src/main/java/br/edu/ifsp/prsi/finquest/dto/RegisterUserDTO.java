package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserDTO (
    @NotBlank(message = "O ID é obrigatório")
    String id,

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    @Size(max = 255, message = "O email deve ter no máximo 255 caracteres")
    String email,

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
    String name
) {}
