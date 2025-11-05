package br.edu.ifsp.prsi.finquest.dto;

public record CourseProgressDTO(
        String id,
        String title,
        String description,
        String icon,
        Integer progress
) {}
