package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.UserLessonCompletion;
import br.edu.ifsp.prsi.finquest.model.UserLessonCompletionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserLessonCompletionRepository extends JpaRepository<UserLessonCompletion, UserLessonCompletionId> {

    List<UserLessonCompletion> findAllByIdUserId(String userId);

    @Query("""
        SELECT c FROM UserLessonCompletion c
        WHERE c.id.userId = :userId
        AND c.lesson.course.id = :courseId
    """)
    List<UserLessonCompletion> findUserCompletionsByCourse(
            @Param("userId") String userId,
            @Param("courseId") String courseId
    );

    @Query("SELECT COUNT(c) FROM UserLessonCompletion c " +
            "WHERE c.id.userId = :userId " +
            "AND c.lesson.course.id = :courseId")
    long countCompletedLessonsByCourse(
            @Param("userId") String userId,
            @Param("courseId") String courseId
    );
}
