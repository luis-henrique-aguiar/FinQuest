package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;

import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.Transaction;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;
import br.edu.ifsp.prsi.finquest.repository.TransactionRepository;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final MissionServiceImpl missionService;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            MissionServiceImpl missionService
    ) {
        this.transactionRepository = transactionRepository;
        this.missionService = missionService;
    }

    @Transactional
    @Override
    public TransactionResponseDTO createTransaction(String userId, CreateTransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(TransactionType.valueOf(dto.type()));
        transaction.setAmount(dto.amount());
        transaction.setDescription(dto.description());
        transaction.setCategory(dto.category());
        transaction.setDate(LocalDate.parse(dto.date()));
        transaction.setNotes(dto.notes());

        Transaction saved = transactionRepository.save(transaction);
        TransactionDTO transactionDTO = TransactionDTO.fromEntity(saved);

        MissionCompletionDTO missionCompletion = missionService.processTransactionCreation(userId);

        return new TransactionResponseDTO(transactionDTO, missionCompletion);
    }


    @Transactional
    @Override
    public TransactionDTO updateTransaction(
            String userId,
            String transactionId,
            UpdateTransactionDTO dto
    ) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized");
        }

        transaction.setType(TransactionType.valueOf(dto.type()));
        transaction.setAmount(dto.amount());
        transaction.setDescription(dto.description());
        transaction.setCategory(dto.category());
        transaction.setDate(LocalDate.parse(dto.date()));
        transaction.setNotes(dto.notes());

        Transaction updated = transactionRepository.save(transaction);
        return TransactionDTO.fromEntity(updated);
    }

    @Transactional
    @Override
    public void deleteTransaction(String userId, String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized");
        }

        transactionRepository.delete(transaction);
    }

    @Override
    public List<TransactionDTO> getAllTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }

    @Override
    public List<TransactionDTO> getTransactionsByPeriod(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        return transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }

    @Override
    public TransactionTypeSumDTO getSumByTypeAndPeriod(String userId, TransactionType type, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(
                    userId, type, startDate, endDate
                ) != null ? transactionRepository.sumByUserIdAndTypeAndDateBetween(
                    userId, type, startDate, endDate
                ) : BigDecimal.ZERO;
        return new TransactionTypeSumDTO(total);
    }

    @Override
    public ExpensesReportDTO getAllExpensesByPeriodGroupedByType(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<ExpenseInfoDTO> expenses = new ArrayList<>();

        List<String> categories = transactionRepository
                .findDistinctCategoriesByUserIdAndTypeAndDateBetween(
                        userId, TransactionType.EXPENSE, startDate, endDate);

        BigDecimal totalAmount = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);

        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return new ExpensesReportDTO(expenses);
        }

        for (String category : categories) {
            BigDecimal amount = transactionRepository
                    .sumByUserIdAndTypeAndDateBetweenAndCategory(
                            userId, TransactionType.EXPENSE, startDate, endDate, category);

            long count = transactionRepository
                    .countByUserIdAndTypeAndDateBetweenAndCategory(
                            userId, TransactionType.EXPENSE, startDate, endDate, category);

            BigDecimal percentage = amount.divide(totalAmount, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            expenses.add(new ExpenseInfoDTO(category, amount, percentage, count));
        }

        expenses.sort(Collections.reverseOrder());
        return new ExpensesReportDTO(expenses);
    }

    @Override
    public YearlyReportDTO getYearlyReport(String userId, int year) {
        List<MonthlyReportDTO> reports = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(year, month);
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();

            long transactionCount = transactionRepository
                    .countByUserIdAndDateBetween(userId, startDate, endDate);

            BigDecimal receitas;
            BigDecimal despesas;

            if (transactionCount > 0) {
                receitas = transactionRepository
                        .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.INCOME, startDate, endDate);
                despesas = transactionRepository
                        .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);
            } else {
                receitas = BigDecimal.ZERO;
                despesas = BigDecimal.ZERO;
            }

            reports.add(new MonthlyReportDTO(
                    MonthlyReportDTO.months[month - 1],
                    receitas,
                    despesas,
                    receitas.subtract(despesas),
                    transactionCount
            ));
        }

        return new YearlyReportDTO(reports);
    }

    @Override
    public DailyExpensesReportDTO getDailyExpensesByPeriod(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<DailyExpenseDTO> dailyExpenses = new ArrayList<>();

        List<LocalDate> dates = transactionRepository
                .findDistinctDatesByUserIdAndTypeAndDateBetween(
                        userId, TransactionType.EXPENSE, startDate, endDate);

        for (LocalDate date : dates) {
            BigDecimal value = transactionRepository
                    .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, date, date);

            long count = transactionRepository
                    .countByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, date, date);

            dailyExpenses.add(new DailyExpenseDTO(
                    String.valueOf(date.getDayOfMonth()),
                    value != null ? value : BigDecimal.ZERO,
                    count
            ));
        }
        return new DailyExpensesReportDTO(dailyExpenses);
    }

    public FinancialOverviewDTO getFinancialOverview(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        BigDecimal totalIncome = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.INCOME, startDate, endDate);

        BigDecimal totalExpense = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? balance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        List<TransactionDTO> recentTransactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
                .stream()
                .limit(10)
                .map(TransactionDTO::fromEntity)
                .toList();

        return new FinancialOverviewDTO(
                totalIncome,
                totalExpense,
                balance,
                savingsRate,
                recentTransactions
        );
    }
}
