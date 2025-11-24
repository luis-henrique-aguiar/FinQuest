package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        String userId = userDetails.getUsername();

        List<TransactionDTO> transactions = (startDate != null && endDate != null)
                ? transactionService.getTransactionsByPeriod(userId, startDate, endDate)
                : transactionService.getAllTransactions(userId);

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/sum")
    public ResponseEntity<TransactionTypeSumDTO> getSumByTransactionType(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam TransactionType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        String userId = userDetails.getUsername();

        return ResponseEntity.ok(transactionService.getSumByTypeAndPeriod(userId,type,startDate,endDate));
    }

    @GetMapping("/categories")
    public ResponseEntity<ExpensesReportDTO> getExpensesByCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        String userId = userDetails.getUsername();

        return ResponseEntity.ok(transactionService.getAllExpensesByPeriodGroupedByType(userId,startDate,endDate));
    }

    @GetMapping("/yearly")
    public ResponseEntity<YearlyReportDTO> getYearlyReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int year
    ){
        String userId = userDetails.getUsername();

        return ResponseEntity.ok(transactionService.getYearlyReport(userId,year));
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyExpensesReportDTO> getDailyExpensesInMonth(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        String userId = userDetails.getUsername();

        return ResponseEntity.ok(transactionService.getDailyExpensesByPeriod(userId,startDate,endDate));
    }
}
