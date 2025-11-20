package br.edu.ifsp.prsi.finquest.dto;

import java.time.LocalDate;

public record UserSummaryDTO(
        String id,
        String name,
        String email,
        int level,
        int totalFinPoints,
        LocalDate lastActivityDate,
        long completedLessons
) {}
