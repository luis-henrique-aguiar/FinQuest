package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.*;
import java.time.LocalDate;
import java.util.List;

public interface TransactionService {

    TransactionDTO createTransaction(String userId, CreateTransactionDTO dto);

    TransactionDTO updateTransaction(String userId, String transactionId, UpdateTransactionDTO dto);

    void deleteTransaction(String userId, String transactionId);

    List<TransactionDTO> getAllTransactions(String userId);

    List<TransactionDTO> getTransactionsByPeriod(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );

    FinancialOverviewDTO getFinancialOverview(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );
}
