package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record LessonUpdateDTO(
    @Size(min = 5, max = 100, message = "O título deve ter entre 5 e 100 caracteres")
    String title,

    @Size(min = 10, max = 50000, message = "O conteúdo deve ter entre 10 e 50000 caracteres")
    String content,

    @Min(value = 0, message = "Os FinPoints devem ser no mínimo 0")
    Integer recFinPoints,

    Boolean isDraft
) {}
