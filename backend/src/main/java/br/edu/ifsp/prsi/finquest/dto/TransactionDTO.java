package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record TransactionDTO(
        String id,
        String type,
        BigDecimal amount,
        String description,
        String category,
        String date,
        String notes
) {}