package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Transaction;

import java.math.BigDecimal;

public record TransactionDTO(
        String id,
        String type,
        BigDecimal amount,
        String description,
        String category,
        String date,
        String notes
) {

    public static TransactionDTO fromEntity(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getType().toString(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getCategory(),
                transaction.getDate().toString(),
                transaction.getNotes()
        );
    }
}
