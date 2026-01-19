package br.edu.ifsp.prsi.finquest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating a new comment
 * 
 * @param postId ID of the post being commented on (required)
 * @param parentId ID of parent comment for nested replies (optional)
 * @param content Comment text (required, max 1000 characters)
 */
public record CommentCreateDTO(
    @NotNull(message = "Post ID is required")
    Long postId,

    Long parentId,

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 1000, message = "Comment content cannot exceed 1000 characters")
    String content
) {}
