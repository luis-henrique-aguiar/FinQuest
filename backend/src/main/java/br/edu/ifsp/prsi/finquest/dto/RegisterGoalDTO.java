package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RegisterGoalDTO(
        @NotBlank(message = "O nome da meta não pode ser vazio.")
        @Size(max = 100, message = "O nome da meta não pode exceder 100 caracteres.")
        String name,

        @NotNull(message = "O Valor Alvo é obrigatório.")
        @DecimalMin(value = "0.01", inclusive = true, message = "O Valor Alvo deve ser maior que zero.")
        BigDecimal targetAmount
) {}
