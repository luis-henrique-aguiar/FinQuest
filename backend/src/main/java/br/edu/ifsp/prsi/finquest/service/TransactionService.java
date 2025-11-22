package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.TransactionDTO;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {

    List<TransactionDTO> getTransactionsByPeriod(String userId,LocalDate startDate,LocalDate endDate);

    List<TransactionDTO> getAllTransactions(String userId);
}
