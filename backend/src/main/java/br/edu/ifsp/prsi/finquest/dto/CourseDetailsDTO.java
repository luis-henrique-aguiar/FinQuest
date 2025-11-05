package br.edu.ifsp.prsi.finquest.dto;

import java.util.List;

public record CourseDetailsDTO(
        String id,
        String title,
        String description,
        List<LessonProgressDTO> lessons
) {}
