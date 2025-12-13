package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.Transaction;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;
import br.edu.ifsp.prsi.finquest.repository.TransactionRepository;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);

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
        logger.info("Iniciando criação de transação: type={}, amount={}, category={}, date={}",
                dto.type(), dto.amount(), dto.category(), dto.date());

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

        logger.debug("Transação persistida no banco com sucesso: id={}", saved.getId());

        MissionCompletionDTO missionCompletion = null;
        try {
            missionCompletion = missionService.processTransactionCreation(userId);
            if (missionCompletion != null && missionCompletion.didLevelUp()) {
                logger.info("Gamificação: Usuário subiu de nível! Level: {}", missionCompletion.level());
            }
        } catch (Exception e) {
            logger.error("Falha não-bloqueante ao processar missões para transação {}: {}",
                    saved.getId(), e.getMessage(), e);
        }

        return new TransactionResponseDTO(transactionDTO, missionCompletion);
    }

    @Transactional
    @Override
    public TransactionDTO updateTransaction(
            String userId,
            String transactionId,
            UpdateTransactionDTO dto
    ) {
        logger.info("Solicitação de atualização: transactionId={}, type={}, amount={}", transactionId, dto.type(), dto.amount());

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> {
                    logger.warn("Tentativa de atualizar transação inexistente: {}", transactionId);
                    return new EntityNotFoundException("Transaction not found");
                });

        if (!transaction.getUserId().equals(userId)) {
            logger.warn("SEGURANÇA: Usuário {} tentou alterar transação {} que pertence a outro usuário!", userId, transactionId);
            throw new BusinessException("Unauthorized");
        }

        transaction.setType(TransactionType.valueOf(dto.type()));
        transaction.setAmount(dto.amount());
        transaction.setDescription(dto.description());
        transaction.setCategory(dto.category());
        transaction.setDate(LocalDate.parse(dto.date()));
        transaction.setNotes(dto.notes());

        Transaction updated = transactionRepository.save(transaction);
        logger.info("Transação atualizada com sucesso: id={}", updated.getId());

        return TransactionDTO.fromEntity(updated);
    }

    @Transactional
    @Override
    public void deleteTransaction(String userId, String transactionId) {
        logger.info("Solicitação de exclusão: transactionId={}", transactionId);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> {
                    logger.warn("Tentativa de excluir transação inexistente: {}", transactionId);
                    return new EntityNotFoundException("Transaction not found");
                });

        if (!transaction.getUserId().equals(userId)) {
            logger.warn("SEGURANÇA: Usuário {} tentou excluir transação {} que pertence a outro usuário!", userId, transactionId);
            throw new BusinessException("Unauthorized");
        }

        transactionRepository.delete(transaction);
        logger.info("Transação excluída com sucesso: id={}", transactionId);
    }

    @Override
    public List<TransactionDTO> getAllTransactions(String userId) {
        logger.debug("Buscando todas as transações do usuário");

        List<TransactionDTO> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();

        logger.debug("Total de transações encontradas: {}", transactions.size());
        return transactions;
    }

    @Override
    public List<TransactionDTO> getTransactionsByPeriod(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        logger.debug("Buscando transações por período: start={}, end={}", startDate, endDate);

        List<TransactionDTO> transactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();

        logger.debug("Transações encontradas no período: {}", transactions.size());
        return transactions;
    }

    @Override
    public TransactionTypeSumDTO getSumByTypeAndPeriod(String userId, TransactionType type, LocalDate startDate, LocalDate endDate) {
        logger.debug("Calculando soma: type={}, start={}, end={}", type, startDate, endDate);

        BigDecimal total = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, type, startDate, endDate);

        BigDecimal result = total != null ? total : BigDecimal.ZERO;

        logger.debug("Soma calculada: {}", result);
        return new TransactionTypeSumDTO(result);
    }

    @Override
    public ExpensesReportDTO getAllExpensesByPeriodGroupedByType(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        logger.info("Gerando relatório de despesas por categoria: start={}, end={}", startDate, endDate);

        List<ExpenseInfoDTO> expenses = new ArrayList<>();

        List<String> categories = transactionRepository
                .findDistinctCategoriesByUserIdAndTypeAndDateBetween(
                        userId, TransactionType.EXPENSE, startDate, endDate);

        BigDecimal totalAmount = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);

        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            logger.debug("Nenhuma despesa encontrada no período.");
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
        logger.info("Relatório gerado com {} categorias. Valor total processado: {}", expenses.size(), totalAmount);

        return new ExpensesReportDTO(expenses);
    }

    @Override
    public YearlyReportDTO getYearlyReport(String userId, int year) {
        logger.info("Gerando relatório anual: year={}", year);
        long startTime = System.currentTimeMillis();

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

        long duration = System.currentTimeMillis() - startTime;
        logger.info("Relatório anual gerado em {}ms", duration);

        return new YearlyReportDTO(reports);
    }

    @Override
    public DailyExpensesReportDTO getDailyExpensesByPeriod(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        logger.debug("Gerando relatório diário: start={}, end={}", startDate, endDate);

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
        logger.info("Gerando Financial Overview: start={}, end={}", startDate, endDate);

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

        logger.debug("Overview calculado: Income={}, Expense={}, Balance={}, SavingsRate={}%",
                totalIncome, totalExpense, balance, savingsRate);

        return new FinancialOverviewDTO(
                totalIncome,
                totalExpense,
                balance,
                savingsRate,
                recentTransactions
        );
    }
}