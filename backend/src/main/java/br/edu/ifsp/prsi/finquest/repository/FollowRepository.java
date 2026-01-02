package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // Check if user follows another user
    boolean existsByFollowerIdAndFollowedId(String followerId, String followedId);

    // Find follow relationship
    Optional<Follow> findByFollowerIdAndFollowedId(String followerId, String followedId);

    // Count followers of a user
    long countByFollowedId(String userId);

    // Count users that a user is following
    long countByFollowerId(String userId);

    // Get all followers of a user
    @Query("SELECT f.follower FROM Follow f WHERE f.followed.id = :userId")
    List<Follow> findFollowersByUserId(@Param("userId") String userId);

    // Get all users that a user is following
    @Query("SELECT f.followed FROM Follow f WHERE f.follower.id = :userId")
    List<Follow> findFollowingByUserId(@Param("userId") String userId);

    // Delete follow relationship
    void deleteByFollowerIdAndFollowedId(String followerId, String followedId);

    // Get follower IDs for a user (for feed queries)
    @Query("SELECT f.follower.id FROM Follow f WHERE f.followed.id = :userId")
    List<Long> findFollowerIdsByUserId(@Param("userId") String userId);

    // Get following IDs for a user (for feed queries)
    @Query("SELECT f.followed.id FROM Follow f WHERE f.follower.id = :userId")
    List<Long> findFollowingIdsByUserId(@Param("userId") String userId);
}
