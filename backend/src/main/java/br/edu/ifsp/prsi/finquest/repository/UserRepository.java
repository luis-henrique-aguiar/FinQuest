package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String email);

    @Query("SELECT AVG(u.totalFinPoints) FROM User u")
    Double findAverageFinPoints();

    @Query("SELECT MAX(u.level) FROM User u")
    Integer findMaxLevel();

}
