package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;
import java.util.List;

public record FinancialOverviewDTO(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        BigDecimal savingsRate,
        List<CategorySummaryDTO> expensesByCategory,
        List<TransactionDTO> recentTransactions
) {}
