package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record UpdateTransactionDTO(
        String type,
        BigDecimal amount,
        String description,
        String category,
        String date,
        String notes
) {}
