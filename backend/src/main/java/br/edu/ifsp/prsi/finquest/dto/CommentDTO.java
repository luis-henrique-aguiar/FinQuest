package br.edu.ifsp.prsi.finquest.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for comment responses
 * 
 * @param id Comment ID
 * @param postId Post ID this comment belongs to
 * @param author Comment author information
 * @param content Comment text
 * @param markedAsUseful Whether marked as useful by post author
 * @param reactionCount Total number of reactions
 * @param currentUserReacted Whether current user has reacted
 * @param replies List of nested replies
 * @param createdAt Creation timestamp
 * @param updatedAt Last update timestamp
 */
public record CommentDTO(
    Long id,
    Long postId,
    UserSimpleDTO author,
    String content,
    Boolean markedAsUseful,
    Integer reactionCount,
    Boolean currentUserReacted,
    List<CommentDTO> replies,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
