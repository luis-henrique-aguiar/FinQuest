package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Post;
import br.edu.ifsp.prsi.finquest.model.PostCategory;
import br.edu.ifsp.prsi.finquest.model.PostStatus;
import br.edu.ifsp.prsi.finquest.model.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Find active posts with pagination
    @Query("SELECT p FROM Post p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Post> findAllActivePosts(Pageable pageable);

    // Find posts by author
    @Query("SELECT p FROM Post p WHERE p.author.id = :userId AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Post> findByAuthorId(@Param("userId") String userId, Pageable pageable);

    // Find posts by category
    @Query("SELECT p FROM Post p WHERE p.category = :category AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Post> findByCategory(@Param("category") PostCategory category, Pageable pageable);

    // Find posts by type
    @Query("SELECT p FROM Post p WHERE p.type = :type AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Post> findByType(@Param("type") PostType type, Pageable pageable);

    // Find posts by followed users (Feed "Seguindo")
    @Query("SELECT p FROM Post p WHERE p.author.id IN " +
           "(SELECT f.followed.id FROM Follow f WHERE f.follower.id = :userId) " +
           "AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Post> findPostsByFollowedUsers(@Param("userId") String userId, Pageable pageable);

    // Find trending posts (most reactions in last 7 days)
    @Query("SELECT p FROM Post p WHERE p.status = 'ACTIVE' " +
           "AND p.createdAt >= CURRENT_TIMESTAMP - 7 DAY " +
           "ORDER BY p.reactionCount DESC, p.createdAt DESC")
    Page<Post> findTrendingPosts(Pageable pageable);

    // Search posts by content
    @Query("SELECT p FROM Post p WHERE p.status = 'ACTIVE' " +
           "AND (LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.hashtags) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> searchPosts(@Param("keyword") String keyword, Pageable pageable);

    // Count posts by author
    long countByAuthorIdAndStatus(String userId, PostStatus status);

    // Find posts for moderation
    @Query("SELECT p FROM Post p WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<Post> findPostsByStatus(@Param("status") PostStatus status, Pageable pageable);

    // Find posts with specific hashtag
    @Query("SELECT p FROM Post p WHERE p.status = 'ACTIVE' " +
           "AND p.hashtags LIKE CONCAT('%', :hashtag, '%') " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findByHashtag(@Param("hashtag") String hashtag, Pageable pageable);

    // Get user's post count
    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :userId AND p.status = 'ACTIVE'")
    long countActivePostsByUserId(@Param("userId") String userId);

    // Find posts created today by user (for daily limit)
    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :userId " +
           "AND DATE(p.createdAt) = CURRENT_DATE")
    long countPostsCreatedTodayByUser(@Param("userId") String userId);
}
