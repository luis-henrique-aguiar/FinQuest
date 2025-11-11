package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Goal;
import br.edu.ifsp.prsi.finquest.utils.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, String> {

    List<Goal> findByUserId(String userId);
    List<Goal> findByUserIdAndStatus(String userId, GoalStatus status);
}
