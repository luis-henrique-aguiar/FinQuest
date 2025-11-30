package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.dto.AchievementStatusDTO;
import br.edu.ifsp.prsi.finquest.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(
            "SELECT new br.edu.ifsp.prsi.finquest.dto.AchievementStatusDTO(" +
                    "    a.id, " +
                    "    a.title, " +
                    "    a.description, " +
                    "    a.icon, " +
                    "    a.requiredLevel, " +
                    "    CASE WHEN ua.id IS NOT NULL THEN TRUE ELSE FALSE END " +
                    ") " +
                    "FROM Achievement a " +
                    "LEFT JOIN UserAchievement ua ON ua.id.achievementId = a.id AND ua.id.userId = :userId"
    )
    List<AchievementStatusDTO> findAllWithStatusByUserId(@Param("userId") String userId);
}
