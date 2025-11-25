package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.CreateTransactionDTO;
import br.edu.ifsp.prsi.finquest.dto.FinancialOverviewDTO;
import br.edu.ifsp.prsi.finquest.dto.TransactionDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateTransactionDTO;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateTransactionDTO dto
    ) {
        String userId = userDetails.getUsername();
        TransactionDTO created = transactionService.createTransaction(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id,
            @Valid @RequestBody UpdateTransactionDTO dto
    ) {
        String userId = userDetails.getUsername();
        TransactionDTO updated = transactionService.updateTransaction(userId, id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id
    ) {
        String userId = userDetails.getUsername();
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.noContent().build();
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

    @GetMapping("/overview")
    public ResponseEntity<FinancialOverviewDTO> getFinancialOverview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        String userId = userDetails.getUsername();

        if (startDate == null || endDate == null) {
            LocalDate now = LocalDate.now();
            startDate = now.withDayOfMonth(1);
            endDate = now.withDayOfMonth(now.lengthOfMonth());
        }

        FinancialOverviewDTO overview = transactionService
                .getFinancialOverview(userId, startDate, endDate);

        return ResponseEntity.ok(overview);
    }
}
