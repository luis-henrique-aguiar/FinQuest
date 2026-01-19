package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record QuizOptionDTO(
    @NotBlank(message = "A letra da opção é obrigatória")
    @Pattern(regexp = "[A-D]", message = "A letra deve ser A, B, C ou D")
    String letter,

    @NotBlank(message = "O texto da opção é obrigatório")
    @Size(min = 1, max = 500, message = "O texto da opção deve ter entre 1 e 500 caracteres")
    String text
) {}
