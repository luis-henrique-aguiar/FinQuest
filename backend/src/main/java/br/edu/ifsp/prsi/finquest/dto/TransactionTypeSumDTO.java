package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record TransactionTypeSumDTO(
        BigDecimal total
) {
    public TransactionTypeSumDTO(BigDecimal total){
        this.total = total;
    }
}
