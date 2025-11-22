package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDate startDate, LocalDate endDate);


    List<Transaction> findByUserIdOrderByDateDesc(String userId);
}
