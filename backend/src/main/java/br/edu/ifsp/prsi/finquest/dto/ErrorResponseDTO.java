package br.edu.ifsp.prsi.finquest.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponseDTO(
    int status,
    String error,
    String message,
    List<String> details,
    String path,
    LocalDateTime timestamp
) {
    public static ErrorResponseDTO validation(String message, List<String> details, String path) {
        return new ErrorResponseDTO(400, "VALIDATION_ERROR", message, details, path,
                LocalDateTime.now());
    }

    public static ErrorResponseDTO business(String message, String path) {
        return new ErrorResponseDTO(409, "CONFLICT", message, null, path,
                LocalDateTime.now());
    }

    public static ErrorResponseDTO notFound(String message, String path) {
        return new ErrorResponseDTO(404, "NOT_FOUND", message, null, path,
                LocalDateTime.now());
    }

    public static ErrorResponseDTO internal(String message, String path) {
        return new ErrorResponseDTO(500, "INTERNAL_ERROR", message, null, path,
                LocalDateTime.now());
    }
}
