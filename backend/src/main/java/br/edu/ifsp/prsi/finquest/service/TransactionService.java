package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {

    List<TransactionDTO> getTransactionsByPeriod(String userId,LocalDate startDate,LocalDate endDate);

    List<TransactionDTO> getAllTransactions(String userId);

    TransactionTypeSumDTO getSumByTypeAndPeriod(String userId, TransactionType type, LocalDate startDate, LocalDate endDate);

    ExpensesReportDTO getAllExpensesByPeriodGroupedByType(String userId, LocalDate startDate, LocalDate endDate);

    YearlyReportDTO getYearlyReport(String userId, int year);

    DailyExpensesReportDTO getDailyExpensesByPeriod(String userId, LocalDate startDate, LocalDate endDate);

    TransactionDTO createTransaction(String userId, CreateTransactionDTO dto);

    TransactionDTO updateTransaction(String userId, String transactionId, UpdateTransactionDTO dto);

    void deleteTransaction(String userId, String transactionId);
    
    FinancialOverviewDTO getFinancialOverview(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );
}
