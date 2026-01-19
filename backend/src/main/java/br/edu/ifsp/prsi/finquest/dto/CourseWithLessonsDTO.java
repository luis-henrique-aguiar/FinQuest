package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Course;

import java.util.List;

public record CourseWithLessonsDTO(
        String id,
        String title,
        String description,
        List<LessonSummaryDTO> lessons
) {
    public CourseWithLessonsDTO(Course course, List<LessonSummaryDTO> lessons) {
        this(course.getId(), course.getTitle(), course.getDescription(), lessons);
    }
}
