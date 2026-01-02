package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Reaction;
import br.edu.ifsp.prsi.finquest.model.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    // Find reaction by user and post
    Optional<Reaction> findByUserIdAndPostId(String userId, Long postId);

    // Find reaction by user and comment
    Optional<Reaction> findByUserIdAndCommentId(String userId, Long commentId);

    // Find all reactions for a post
    @Query("SELECT r FROM Reaction r WHERE r.post.id = :postId")
    List<Reaction> findByPostId(@Param("postId") Long postId);

    // Find all reactions for a comment
    @Query("SELECT r FROM Reaction r WHERE r.comment.id = :commentId")
    List<Reaction> findByCommentId(@Param("commentId") Long commentId);

    // Count reactions by type for a post
    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post.id = :postId AND r.reactionType = :type")
    long countByPostIdAndReactionType(@Param("postId") Long postId, @Param("type") ReactionType type);

    // Count reactions by type for a comment
    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.comment.id = :commentId AND r.reactionType = :type")
    long countByCommentIdAndReactionType(@Param("commentId") Long commentId, @Param("type") ReactionType type);

    // Count total reactions for a post
    long countByPostId(Long postId);

    // Count total reactions for a comment
    long countByCommentId(Long commentId);

    // Delete reaction by user and post
    void deleteByUserIdAndPostId(String userId, Long postId);

    // Delete reaction by user and comment
    void deleteByUserIdAndCommentId(String userId, Long commentId);

    // Delete all reactions for a post
    void deleteByPostId(Long postId);

    // Delete all reactions for a comment
    void deleteByCommentId(Long commentId);

    // Check if user has reacted to a post
    boolean existsByUserIdAndPostId(String userId, Long postId);

    // Check if user has reacted to a comment
    boolean existsByUserIdAndCommentId(String userId, Long commentId);
}
