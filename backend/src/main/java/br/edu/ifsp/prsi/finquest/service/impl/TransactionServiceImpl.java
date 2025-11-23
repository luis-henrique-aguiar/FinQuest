package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.ExpenseInfoDTO;
import br.edu.ifsp.prsi.finquest.dto.ExpensesReportDTO;
import br.edu.ifsp.prsi.finquest.dto.TransactionDTO;
import br.edu.ifsp.prsi.finquest.dto.TransactionTypeSumDTO;
import br.edu.ifsp.prsi.finquest.model.Transaction;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;
import br.edu.ifsp.prsi.finquest.repository.TransactionRepository;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository){
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<TransactionDTO> getTransactionsByPeriod(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ){
        return transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public List<TransactionDTO> getAllTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(this::toDTO)
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
        List<String> categories = transactionRepository.findAllCategoriesByUserIdAndDateBetweenAndType(userId,TransactionType.EXPENSE,startDate,endDate);
        BigDecimal total_amount = transactionRepository.sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);
        BigDecimal amount;
        long count;
        BigDecimal percentage;
        for(String category : categories){
            amount = transactionRepository.sumByUserIdAndTypeAndDateBetweenAndCategory(userId,TransactionType.EXPENSE,startDate,endDate,category);
            count = transactionRepository.countByUserIdAndTypeAndDateBetweenAndCategory(userId,TransactionType.EXPENSE,startDate,endDate,category);
            percentage = amount.divide(total_amount).multiply(BigDecimal.valueOf(100));
            expenses.add(new ExpenseInfoDTO(category,amount, percentage, count));
        }
        expenses.sort(Collections.reverseOrder());
        return new ExpensesReportDTO(expenses);
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
