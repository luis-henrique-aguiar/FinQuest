package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.NotNull;

public record LessonReorderDTO(
        @NotNull(message = "O ID da lição é obrigatório")
        String lessonId,
        
        @NotNull(message = "A nova ordem é obrigatória")
        Integer newOrder
) {}
