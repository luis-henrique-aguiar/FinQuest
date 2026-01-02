package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {

    // Find all images for a post ordered by imageOrder
    @Query("SELECT pi FROM PostImage pi WHERE pi.post.id = :postId ORDER BY pi.imageOrder ASC")
    List<PostImage> findByPostIdOrderByImageOrderAsc(@Param("postId") Long postId);

    // Delete all images for a post
    void deleteByPostId(Long postId);

    // Count images for a post
    long countByPostId(Long postId);
}
