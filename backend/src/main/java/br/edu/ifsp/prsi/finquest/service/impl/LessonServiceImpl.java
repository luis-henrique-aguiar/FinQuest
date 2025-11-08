package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;
import br.edu.ifsp.prsi.finquest.model.Lesson;
import br.edu.ifsp.prsi.finquest.repository.LessonRepository;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public LessonDetailsDTO getLessonDetails(String lessonId) {
        Lesson currentLesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lição não encontrada: " + lessonId));

        String courseId = currentLesson.getCourse().getId();
        int currentOrder = currentLesson.getLessonOrder();

        String nextLessonId = lessonRepository
                .findByCourseIdAndLessonOrder(courseId, currentOrder + 1)
                .map(Lesson::getId)
                .orElse(null);

        String previousLessonId = lessonRepository
                .findByCourseIdAndLessonOrder(courseId, currentOrder - 1)
                .map(Lesson::getId)
                .orElse(null);

        return new LessonDetailsDTO(currentLesson, nextLessonId, previousLessonId);
    }
}
