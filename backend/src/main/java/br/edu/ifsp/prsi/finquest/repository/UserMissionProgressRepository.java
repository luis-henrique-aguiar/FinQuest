package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.UserMissionProgress;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgressId;
import br.edu.ifsp.prsi.finquest.model.enums.MissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMissionProgressRepository extends JpaRepository<UserMissionProgress, UserMissionProgressId> {

    List<UserMissionProgress> findAllByIdUserId(String userId);

    long countByStatus(MissionStatus status);

    @Query("SELECT COUNT(ump) FROM UserMissionProgress ump WHERE ump.status = 'COMPLETED'")
    long countByStatusCompleted();

}
