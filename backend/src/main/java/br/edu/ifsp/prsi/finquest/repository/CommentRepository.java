package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Find top-level comments for a post (parent = null)
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL " +
           "ORDER BY c.createdAt DESC")
    Page<Comment> findTopLevelCommentsByPostId(@Param("postId") Long postId, Pageable pageable);

    // Find replies to a comment
    @Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentId(@Param("parentId") Long parentId);

    // Count comments for a post (including replies)
    long countByPostId(Long postId);

    // Count top-level comments for a post
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL")
    long countTopLevelCommentsByPostId(@Param("postId") Long postId);

    // Find comments by author
    @Query("SELECT c FROM Comment c WHERE c.author.id = :userId ORDER BY c.createdAt DESC")
    Page<Comment> findByAuthorId(@Param("userId") String userId, Pageable pageable);

    // Find useful comments (for gamification)
    @Query("SELECT c FROM Comment c WHERE c.markedAsUseful = true AND c.author.id = :userId")
    List<Comment> findUsefulCommentsByAuthor(@Param("userId") String userId);

    // Count useful comments by author
    long countByAuthorIdAndMarkedAsUseful(String userId, boolean markedAsUseful);

    // Delete all comments for a post
    void deleteByPostId(Long postId);
}
