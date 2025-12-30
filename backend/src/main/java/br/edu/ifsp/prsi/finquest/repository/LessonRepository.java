package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId ORDER BY l.lessonOrder ASC")
    List<Lesson> findAllByCourseIdOrderByLessonOrderAsc(@Param("courseId") String courseId);

    Optional<Lesson> findByCourseIdAndLessonOrder(String courseId, Integer lessonOrder);

    long countByCourseId(String courseId);

    // Content Management Queries
    boolean existsByCourseIdAndLessonOrder(String courseId, Integer lessonOrder);

    @Query("SELECT l FROM Lesson l JOIN FETCH l.course c " +
           "WHERE l.deletedAt IS NULL " +
           "AND (:courseId IS NULL OR c.id = :courseId) " +
           "AND (:isDraft IS NULL OR l.isDraft = :isDraft) " +
           "ORDER BY c.id ASC, l.lessonOrder ASC")
    List<Lesson> findAllForAdmin(@Param("courseId") String courseId, @Param("isDraft") Boolean isDraft);

}
