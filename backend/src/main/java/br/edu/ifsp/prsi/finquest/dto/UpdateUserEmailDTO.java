package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserEmailDTO(
        @NotBlank(message = "O email não pode ser vazio.")
        @Email(message = "Formato de email inválido.")
        String email
) {}
