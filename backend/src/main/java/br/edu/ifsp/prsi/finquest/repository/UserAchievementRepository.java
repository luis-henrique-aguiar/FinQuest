package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.UserAchievement;
import br.edu.ifsp.prsi.finquest.model.UserAchievementId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UserAchievementId> {

    /**
     * Busca todas as conquistas de um usuário
     */
    List<UserAchievement> findByIdUserId(String userId);

    /**
     * Verifica se o usuário já possui uma conquista específica
     */
    @Query("SELECT CASE WHEN COUNT(ua) > 0 THEN true ELSE false END " +
            "FROM UserAchievement ua " +
            "WHERE ua.id.userId = :userId AND ua.id.achievementId = :achievementId")
    boolean existsByUserIdAndAchievementId(@Param("userId") String userId,
                                           @Param("achievementId") Long achievementId);
}
