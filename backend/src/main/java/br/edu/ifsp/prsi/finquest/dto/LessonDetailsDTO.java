package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Lesson;

public record LessonDetailsDTO(
        String id,
        String title,
        String courseId,
        int lessonOrder,
        int recFinPoints,
        String nextLessonId,
        String previousLessonId
) {
    public LessonDetailsDTO(Lesson lesson, String nextLessonId, String previousLessonId) {
        this(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getCourse().getId(),
                lesson.getLessonOrder(),
                lesson.getRecFinPoints(),
                nextLessonId,
                previousLessonId
        );
    }
}
