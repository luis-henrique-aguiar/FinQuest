package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record QuizCreateDTO(
    @NotBlank(message = "A pergunta é obrigatória")
    @Size(min = 10, max = 500, message = "A pergunta deve ter entre 10 e 500 caracteres")
    String question,

    @NotEmpty(message = "As opções são obrigatórias")
    @Size(min = 4, max = 4, message = "Devem existir exatamente 4 opções")
    @Valid
    List<QuizOptionDTO> options,

    @NotBlank(message = "A resposta correta é obrigatória")
    @Size(min = 1, max = 1, message = "A resposta correta deve ser uma única letra (A, B, C ou D)")
    String correctAnswer,

    @NotBlank(message = "A explicação é obrigatória")
    @Size(min = 10, max = 1000, message = "A explicação deve ter entre 10 e 1000 caracteres")
    String explanation
) {}
