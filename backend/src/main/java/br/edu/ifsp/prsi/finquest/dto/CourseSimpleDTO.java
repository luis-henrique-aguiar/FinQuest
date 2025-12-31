package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Course;

public record CourseSimpleDTO(
        String id,
        String title,
        String description
) {
    public CourseSimpleDTO(Course course) {
        this(course.getId(), course.getTitle(), course.getDescription());
    }
}
