package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserNameDTO(
        @NotBlank(message = "O nome não pode ser vazio.")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
        String name
) {}
