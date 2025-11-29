package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record CategorySummaryDTO(
        String category,
        BigDecimal amount,
        BigDecimal percentage,
        Integer count
) {}
