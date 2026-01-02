package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.model.PostCategory;
import br.edu.ifsp.prsi.finquest.model.PostType;
import br.edu.ifsp.prsi.finquest.model.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommunityService {

    // Post operations
    PostDTO createPost(PostCreateDTO postCreateDTO, String userId);
    PostDTO getPostById(Long postId, String currentUserId);
    Page<PostDTO> getFeedForYou(String userId, Pageable pageable);
    Page<PostDTO> getFeedFollowing(String userId, Pageable pageable);
    Page<PostDTO> getExploreFeed(Pageable pageable);
    Page<PostDTO> getPostsByCategory(PostCategory category, Pageable pageable);
    Page<PostDTO> getPostsByType(PostType type, Pageable pageable);
    Page<PostDTO> getPostsByAuthor(String authorId, String currentUserId, Pageable pageable);
    Page<PostDTO> searchPosts(String keyword, Pageable pageable);
    void deletePost(Long postId, String userId);
    PostDTO updatePost(Long postId, PostCreateDTO postCreateDTO, String userId);

    // Achievement post auto-generation
    PostDTO createAchievementPost(String userId, String achievementType, String achievementDetails);

    // Comment operations
    CommentDTO createComment(CommentCreateDTO commentCreateDTO, String userId);
    Page<CommentDTO> getCommentsByPostId(Long postId, String currentUserId, Pageable pageable);
    void deleteComment(Long commentId, String userId);
    CommentDTO markCommentAsUseful(Long commentId, String postAuthorId);

    // Reaction operations
    void addReactionToPost(Long postId, ReactionType reactionType, String userId);
    void removeReactionFromPost(Long postId, String userId);
    void addReactionToComment(Long commentId, ReactionType reactionType, String userId);
    void removeReactionFromComment(Long commentId, String userId);

    // Follow operations
    void followUser(String followedId, String followerId);
    void unfollowUser(String followedId, String followerId);
    boolean isFollowing(String followerId, String followedId);
    long getFollowerCount(String userId);
    long getFollowingCount(String userId);

    // Report operations
    void reportPost(Long postId, ReportCreateDTO reportCreateDTO, String userId);
    void reportComment(Long commentId, ReportCreateDTO reportCreateDTO, String userId);

    // User profile stats
    UserSimpleDTO getUserProfile(String userId, String currentUserId);
}
