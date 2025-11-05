package br.edu.ifsp.prsi.finquest.dto;

import java.util.UUID;

public record CourseProgressDTO(
        String id,
        String title,
        String description,
        String icon,
        Integer progress
) {}
