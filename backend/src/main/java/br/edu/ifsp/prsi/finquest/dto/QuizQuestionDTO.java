package br.edu.ifsp.prsi.finquest.dto;

import java.util.List;

public record QuizQuestionDTO(
        String question,
        List<QuizOptionDTO> options,
        String correctAnswer,
        String explanation
) {}
