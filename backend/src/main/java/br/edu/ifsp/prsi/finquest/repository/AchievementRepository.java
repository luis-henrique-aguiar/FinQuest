package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    /**
     * Busca o badge específico de um nível
     */
    Optional<Achievement> findByRequiredLevel(int level);

    /**
     * Busca todos os badges que podem ser desbloqueados até um determinado nível
     */
    List<Achievement> findByRequiredLevelLessThanEqualOrderByRequiredLevelAsc(int level);
}
