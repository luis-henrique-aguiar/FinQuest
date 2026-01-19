package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.*;

public record CourseCreateDTO(
        @NotBlank(message = "O ID do curso é obrigatório")
        @Pattern(regexp = "^M\\d+$", message = "O ID deve seguir o formato M seguido de números (ex: M1, M10)")
        String id,

        @NotBlank(message = "O título é obrigatório")
        @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres")
        String title,

        @NotBlank(message = "A descrição é obrigatória")
        @Size(min = 10, max = 500, message = "A descrição deve ter entre 10 e 500 caracteres")
        String description,

        @NotBlank(message = "O ícone é obrigatório")
        String icon,

        @NotNull(message = "Os pontos recomendados são obrigatórios")
        @Min(value = 0, message = "Os pontos devem ser no mínimo 0")
        @Max(value = 10000, message = "Os pontos devem ser no máximo 10000")
        Integer recFinPoints
) {
}
