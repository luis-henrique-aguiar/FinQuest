package br.edu.ifsp.prsi.finquest.dto;

import java.util.UUID;

public record CourseProgressDTO(
        UUID id,
        String title,
        String description,
        String icon,
        Integer progress
) {}
