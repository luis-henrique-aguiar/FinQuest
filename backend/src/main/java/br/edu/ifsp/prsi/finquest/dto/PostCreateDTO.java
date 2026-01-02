package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.PostCategory;
import br.edu.ifsp.prsi.finquest.model.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * DTO for creating a new post in the community
 * 
 * @param type Post type (required)
 * @param category Post category (required)
 * @param content Post content (required, max 2000 characters)
 * @param hashtags Hashtags for post discoverability
 * @param imageUrls List of image URLs to attach
 * @param relatedLessonId Optional reference to a lesson
 * @param relatedGoalId Optional reference to a goal
 */
public record PostCreateDTO(
    @NotNull(message = "Post type is required")
    PostType type,

    @NotNull(message = "Post category is required")
    PostCategory category,

    @NotBlank(message = "Post content cannot be empty")
    @Size(max = 2000, message = "Post content cannot exceed 2000 characters")
    String content,

    @Size(max = 500, message = "Hashtags cannot exceed 500 characters")
    String hashtags,

    @Size(max = 10, message = "Maximum 10 images allowed")
    List<String> imageUrls,

    Long relatedLessonId,

    Long relatedGoalId
) {}
