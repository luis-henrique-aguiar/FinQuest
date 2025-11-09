package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {

    List<Lesson> findAllByCourseIdOrderByLessonOrderAsc(String courseId);

    Optional<Lesson> findByCourseIdAndLessonOrder(String courseId, Integer lessonOrder);

    long countByCourseId(String courseId);

}
