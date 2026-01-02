package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.PostCategory;
import br.edu.ifsp.prsi.finquest.model.PostStatus;
import br.edu.ifsp.prsi.finquest.model.PostType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for post responses
 * 
 * @param id Post ID
 * @param author Post author information
 * @param type Post type
 * @param category Post category
 * @param content Post text content
 * @param hashtags Hashtags for discoverability
 * @param imageUrls List of attached image URLs
 * @param relatedLessonId Optional reference to a lesson
 * @param relatedGoalId Optional reference to a goal
 * @param status Post status (ACTIVE, MODERATED, REMOVED)
 * @param reactionCount Total number of reactions
 * @param commentCount Total number of comments
 * @param shareCount Total number of shares
 * @param reactionsByType Map of reaction counts by type
 * @param currentUserReacted Whether current user has reacted
 * @param currentUserFollowsAuthor Whether current user follows the author
 * @param createdAt Creation timestamp
 * @param updatedAt Last update timestamp
 */
public record PostDTO(
    Long id,
    UserSimpleDTO author,
    PostType type,
    PostCategory category,
    String content,
    String hashtags,
    List<String> imageUrls,
    Long relatedLessonId,
    Long relatedGoalId,
    PostStatus status,
    Integer reactionCount,
    Integer commentCount,
    Integer shareCount,
    Map<String, Integer> reactionsByType,
    Boolean currentUserReacted,
    Boolean currentUserFollowsAuthor,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
