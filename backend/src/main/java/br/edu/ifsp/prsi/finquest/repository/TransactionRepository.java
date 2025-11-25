package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Transaction;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByUserIdOrderByDateDesc(String userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Transaction> findByUserIdAndTypeOrderByDateDesc(
            String userId,
            TransactionType type
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.userId = :userId AND t.type = :type " +
            "AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserIdAndTypeAndDateBetween(
            @Param("userId") String userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.userId = :userId AND t.type = 'EXPENSE' " +
            "AND t.date BETWEEN :startDate AND :endDate " +
            "GROUP BY t.category")
    List<Object[]> findExpensesByCategory(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
