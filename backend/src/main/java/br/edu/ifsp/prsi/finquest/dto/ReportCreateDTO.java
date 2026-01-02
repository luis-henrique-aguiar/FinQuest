package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a report on posts or comments
 * 
 * @param postId ID of the post being reported (optional - mutually exclusive with commentId)
 * @param commentId ID of the comment being reported (optional - mutually exclusive with postId)
 * @param reportType Type of report (required)
 * @param description Additional details about the report (required, max 1000 characters)
 */
public record ReportCreateDTO(
    Long postId,

    Long commentId,

    @NotNull(message = "Report type is required")
    ReportType reportType,

    @NotBlank(message = "Report description cannot be empty")
    @Size(max = 1000, message = "Report description cannot exceed 1000 characters")
    String description
) {}
