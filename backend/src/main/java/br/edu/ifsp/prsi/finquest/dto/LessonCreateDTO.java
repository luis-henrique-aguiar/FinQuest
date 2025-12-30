package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.*;

public record LessonCreateDTO(
    @NotBlank(message = "O título é obrigatório")
    @Size(min = 5, max = 100, message = "O título deve ter entre 5 e 100 caracteres")
    String title,

    @NotBlank(message = "O ID do curso é obrigatório")
    String courseId,

    @NotNull(message = "A ordem da lição é obrigatória")
    @Min(value = 1, message = "A ordem da lição deve ser no mínimo 1")
    Integer lessonOrder,

    @NotBlank(message = "O conteúdo é obrigatório")
    @Size(min = 10, max = 50000, message = "O conteúdo deve ter entre 10 e 50000 caracteres")
    String content,

    @NotNull(message = "Os FinPoints recomendados são obrigatórios")
    @Min(value = 0, message = "Os FinPoints devem ser no mínimo 0")
    Integer recFinPoints,

    Boolean isDraft
) {
    public LessonCreateDTO {
        if (isDraft == null) {
            isDraft = true;
        }
    }
}
