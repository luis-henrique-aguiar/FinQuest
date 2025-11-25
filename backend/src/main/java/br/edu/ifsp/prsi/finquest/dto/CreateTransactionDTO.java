package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateTransactionDTO(

        @NotBlank(message = "O tipo da transação é obrigatório.")
        @Pattern(regexp = "^(INCOME|EXPENSE)$", message = "O tipo deve ser 'INCOME' ou 'EXPENSE'.")
        String type,

        @NotNull(message = "O valor da transação é obrigatório.")
        @Positive(message = "O valor da transação deve ser maior que zero.")
        BigDecimal amount,

        @NotBlank(message = "A descrição é obrigatória.")
        @Size(min = 3, max = 255, message = "A descrição deve ter entre 3 e 255 caracteres.")
        String description,

        @NotBlank(message = "A categoria é obrigatória.")
        @Size(max = 50, message = "A categoria deve ter no máximo 50 caracteres.")
        String category,

        @NotNull(message = "A data é obrigatória.")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "A data deve estar no formato AAAA-MM-DD.")
        String date,

        @Size(max = 500, message = "As observações não podem exceder 500 caracteres.")
        String notes
) {}
