package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.*;

public record CourseUpdateDTO(
        @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres")
        String title,

        @Size(min = 10, max = 500, message = "A descrição deve ter entre 10 e 500 caracteres")
        String description,

        String icon,

        @Min(value = 0, message = "Os pontos devem ser no mínimo 0")
        @Max(value = 10000, message = "Os pontos devem ser no máximo 10000")
        Integer recFinPoints
) {
}
