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

        return toDTO(saved);
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
        return toDTO(updated);
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
                .map(this::toDTO)
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
                .map(this::toDTO)
                .toList();
    }

    @Override
    public FinancialOverviewDTO getFinancialOverview(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        BigDecimal totalIncome = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(
                        userId, TransactionType.INCOME, startDate, endDate
                ) != null ? transactionRepository.sumByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startDate, endDate
        ) : BigDecimal.ZERO;

        BigDecimal totalExpense = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(
                        userId, TransactionType.EXPENSE, startDate, endDate
                ) != null ? transactionRepository.sumByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startDate, endDate
        ) : BigDecimal.ZERO;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? balance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        List<Object[]> categoryData = transactionRepository
                .findExpensesByCategory(userId, startDate, endDate);

        List<CategorySummaryDTO> expensesByCategory = categoryData.stream()
                .map(data -> {
                    String category = (String) data[0];
                    BigDecimal amount = (BigDecimal) data[1];
                    BigDecimal percentage = totalExpense.compareTo(BigDecimal.ZERO) > 0
                            ? amount.divide(totalExpense, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            : BigDecimal.ZERO;

                    int count = (int) transactionRepository
                            .findByUserIdAndDateBetweenOrderByDateDesc(
                                    userId, startDate, endDate
                            )
                            .stream()
                            .filter(t -> t.getCategory().equals(category))
                            .count();

                    return new CategorySummaryDTO(category, amount, percentage, count);
                })
                .toList();

        List<TransactionDTO> recentTransactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
                .stream()
                .limit(10)
                .map(this::toDTO)
                .toList();

        return new FinancialOverviewDTO(
                totalIncome,
                totalExpense,
                balance,
                savingsRate,
                expensesByCategory,
                recentTransactions
        );
    }

    private TransactionDTO toDTO(Transaction transaction) {
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