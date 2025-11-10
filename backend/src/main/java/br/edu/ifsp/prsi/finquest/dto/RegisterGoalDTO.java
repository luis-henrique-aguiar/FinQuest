package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class RegisterGoalDTO {
    @NotBlank(message = "O nome da meta não pode ser vazio.")
    @Size(max = 100, message = "O nome da meta não pode exceder 100 caracteres.")
    private String name;

    @NotNull(message = "O Valor Alvo é obrigatório.")
    @DecimalMin(value = "0.01", inclusive = true, message = "O Valor Alvo deve ser maior que zero.")
    private BigDecimal targetAmount;

    public RegisterGoalDTO() {}

    public RegisterGoalDTO(String name, BigDecimal targetAmount) {
        this.name = name;
        this.targetAmount = targetAmount;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }
}
