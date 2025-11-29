package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DepositDTO(
        @NotNull(message = "O valor do depósito é obrigatório.")
        @DecimalMin(value = "0.01", inclusive = true, message = "O valor deve ser positivo.")
        BigDecimal amount
) {}