package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record ExpenseInfoDTO(
        String category,
        BigDecimal amount,
        BigDecimal percentage,
        long count
) implements Comparable<ExpenseInfoDTO>{

    @Override
    public int compareTo(ExpenseInfoDTO o) {
        return this.amount.compareTo(o.amount);
    }
}
