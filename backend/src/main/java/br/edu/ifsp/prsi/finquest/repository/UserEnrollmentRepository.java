package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.model.UserEnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEnrollmentRepository extends JpaRepository<UserEnrollment, UserEnrollmentId> {

    List<UserEnrollment> findByIdUserId(String userId);
}
