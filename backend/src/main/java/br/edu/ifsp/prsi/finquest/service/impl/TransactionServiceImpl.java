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
import java.util.List;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    @Override
    public TransactionDTO createTransaction(String userId, CreateTransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(TransactionType.valueOf(dto.type()));
        transaction.setAmount(dto.amount());
        transaction.setDescription(dto.description());
        transaction.setCategory(dto.category());
        transaction.setDate(LocalDate.parse(dto.date()));
        transaction.setNotes(dto.notes());

        Transaction saved = transactionRepository.save(transaction);

        return TransactionDTO.fromEntity(saved);
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
    public ExpensesReportDTO getAllExpensesByPeriodGroupedByType(String userId, LocalDate startDate, LocalDate endDate) {
        List<ExpenseInfoDTO> expenses = new ArrayList<>();

        List<String> categories = transactionRepository
                .findAllCategoriesByUserIdAndDateBetweenAndType(userId,TransactionType.EXPENSE,startDate,endDate);

        BigDecimal total_amount = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);

        BigDecimal amount;
        long count;
        BigDecimal percentage;

        for (String category : categories){
            amount = transactionRepository
                    .sumByUserIdAndTypeAndDateBetweenAndCategory(userId,TransactionType.EXPENSE,startDate,endDate,category);

            count = transactionRepository
                    .countByUserIdAndTypeAndDateBetweenAndCategory(userId,TransactionType.EXPENSE,startDate,endDate,category);

            percentage = amount.divide(total_amount).multiply(BigDecimal.valueOf(100));
            expenses.add(new ExpenseInfoDTO(category,amount, percentage, count));
        }

        expenses.sort(Collections.reverseOrder());
        return new ExpensesReportDTO(expenses);
    }

    @Override
    public YearlyReportDTO getYearlyReport(String userId, int year) {
        List<MonthlyReportDTO> reports = new ArrayList<>();
        BigDecimal receitas;
        BigDecimal despesas;
        long transactionCount;
        LocalDate startDate;
        LocalDate endDate;
        for(int i=0; i<MonthlyReportDTO.months.length; i++){
            startDate = LocalDate.of(year, (i+1), 1);
            endDate = LocalDate.of(year, (i+1), 31);
            transactionCount = transactionRepository.countByUserIdAndDateBetween(userId,startDate,endDate);
            if(transactionCount>0){
                receitas = transactionRepository.sumByUserIdAndTypeAndDateBetween(userId,TransactionType.INCOME,startDate,endDate);
                despesas = transactionRepository.sumByUserIdAndTypeAndDateBetween(userId,TransactionType.EXPENSE,startDate,endDate);
                reports.add(new MonthlyReportDTO(MonthlyReportDTO.months[i],receitas,despesas,receitas.subtract(despesas),transactionCount));
            }else{
                reports.add(new MonthlyReportDTO(MonthlyReportDTO.months[i],BigDecimal.ZERO,BigDecimal.ZERO,BigDecimal.ZERO,transactionCount));
            }
        }
        return new YearlyReportDTO(reports);
    }

    @Override
    public DailyExpensesReportDTO getDailyExpensesByPeriod(String userId, LocalDate startDate, LocalDate endDate) {
        List<DailyExpenseDTO> dailyExpenses = new ArrayList<>();
        List<LocalDate> dates = transactionRepository.findDistinctDatesByUseridAndDateBetweenAndType(userId,startDate,endDate, TransactionType.EXPENSE);
        for(LocalDate date : dates){
            dailyExpenses.add(new DailyExpenseDTO(Integer.toString(date.getDayOfMonth()),
                    transactionRepository.sumByUserIdAndTypeAndDateBetween(userId,TransactionType.EXPENSE,date,date),
                    transactionRepository.countByUserIdAndTypeAndDateBetween(userId,TransactionType.EXPENSE,date,date)));
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
