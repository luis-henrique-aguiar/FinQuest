package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.ReactionType;

import java.time.LocalDateTime;

/**
 * DTO for reaction responses
 * 
 * @param id Reaction ID
 * @param user User who created the reaction
 * @param reactionType Type of reaction
 * @param createdAt Creation timestamp
 */
public record ReactionDTO(
    Long id,
    UserSimpleDTO user,
    ReactionType reactionType,
    LocalDateTime createdAt
) {}
