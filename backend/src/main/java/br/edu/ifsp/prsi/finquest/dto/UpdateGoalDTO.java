package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateGoalDTO (
        @NotBlank(message = "O nome da meta não pode ser vazio.")
        @Size(max = 100, message = "O nome da meta não pode exceder 100 caracteres.")
        String name,

        @NotNull(message = "O valor alvo é obrigatório.")
        @DecimalMin(value = "0.01", inclusive = true, message = "O valor alvo deve ser maior que zero.")
        BigDecimal targetAmount,

        @NotNull(message = "O valor atual é obrigatório.")
        @DecimalMin(value = "0.00", inclusive = true, message = "O valor atual deve ser maior ou igual a zero.")
        BigDecimal currentAmount
) {}
