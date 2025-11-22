package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.TransactionDTO;
import br.edu.ifsp.prsi.finquest.model.Transaction;
import br.edu.ifsp.prsi.finquest.repository.TransactionRepository;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
