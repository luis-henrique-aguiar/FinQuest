package br.edu.ifsp.prsi.finquest.dto;

import java.time.LocalDateTime;

public record LessonSummaryDTO(
    String id,
    String title,
    String courseId,
    String courseName,
    Integer lessonOrder,
    Boolean isDraft,
    LocalDateTime lastModified
) {}
