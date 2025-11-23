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
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByUserIdOrderByDateDesc(String userId);

    @Query("SELECT SUM(t.amount) FROM Transaction t " +
            "WHERE t.userId = :userId AND t.type = :type " +
            "AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserIdAndTypeAndDateBetween(
            @Param("userId") String userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT t.category FROM Transaction t
        WHERE t.userId = :userId
        AND t.date BETWEEN :startDate AND :endDate
        AND t.type = 'EXPENSE'
    """)
    List<String> findAllCategoriesByUserIdAndDateBetweenAndType(
            @Param("userId") String userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT SUM(t.amount) FROM Transaction t
        WHERE t.userId = :userId
        AND t.date BETWEEN :startDate AND :endDate
        AND t.type = 'EXPENSE'
        AND t.category = :category
        GROUP BY t.category
    """)
    BigDecimal sumByUserIdAndTypeAndDateBetweenAndCategory(
            @Param("userId") String userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category
    );

    @Query("""
        SELECT COUNT(t) FROM Transaction t
        WHERE t.userId = :userId
        AND t.date BETWEEN :startDate AND :endDate
        AND t.type = 'EXPENSE'
        AND t.category = :category
        GROUP BY t.category
    """)
    long countByUserIdAndTypeAndDateBetweenAndCategory(
            @Param("userId") String userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category
    );
}
