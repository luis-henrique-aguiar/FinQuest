package br.edu.ifsp.prsi.finquest.dto;

/**
 * DTO for simplified user information
 * 
 * @param id User ID (Firebase UID - String)
 * @param name User display name
 * @param email User email
 * @param photoUrl User profile photo URL
 * @param bio User bio/description
 * @param level User level (gamification)
 * @param totalXp Total XP earned
 * @param followerCount Number of followers
 * @param followingCount Number of users being followed
 */
public record UserSimpleDTO(
    String id,
    String name,
    String email,
    String photoUrl,
    String bio,
    Integer level,
    Integer totalXp,
    Integer followerCount,
    Integer followingCount
) {
    /**
     * Constructor for basic user information (ID, name, email)
     */
    public UserSimpleDTO(String id, String name, String email) {
        this(id, name, email, null, null, null, null, null, null);
    }
}
