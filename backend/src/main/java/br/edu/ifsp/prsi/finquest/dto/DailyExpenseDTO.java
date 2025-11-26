package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record DailyExpenseDTO(
        String day,
        BigDecimal value,
        long count
) {
}
