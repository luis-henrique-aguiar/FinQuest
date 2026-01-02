package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.model.PostCategory;
import br.edu.ifsp.prsi.finquest.model.PostType;
import br.edu.ifsp.prsi.finquest.model.ReactionType;
import br.edu.ifsp.prsi.finquest.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Community features
 * Handles posts, comments, reactions, follows, and reports
 */
@RestController
@RequestMapping("/community")
@Tag(name = "Community", description = "Community social features API")
@SecurityRequirement(name = "bearerAuth")
public class CommunityController {

    private static final Logger logger = LoggerFactory.getLogger(CommunityController.class);
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    // ========================================
    // Post Operations
    // ========================================

    @PostMapping("/posts")
    @Operation(summary = "Create a new post", description = "Creates a new post in the community")
    @ApiResponse(responseCode = "201", description = "Post created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or daily limit exceeded")
    public ResponseEntity<PostDTO> createPost(
            @Valid @RequestBody PostCreateDTO postCreateDTO) {
        logger.info("📝 Creating post: type={}, category={}", postCreateDTO.type(), postCreateDTO.category());

        String userId = getCurrentUserId();
        PostDTO post = communityService.createPost(postCreateDTO, userId);

        logger.info("✅ Post created successfully: postId={}", post.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping("/posts/{postId}")
    @Operation(summary = "Get post by ID", description = "Retrieves a specific post by its ID")
    @ApiResponse(responseCode = "200", description = "Post found")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<PostDTO> getPost(
            @Parameter(description = "Post ID") @PathVariable Long postId) {
        logger.debug("🔍 Fetching post: postId={}", postId);

        String userId = getCurrentUserId();
        PostDTO post = communityService.getPostById(postId, userId);

        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts/feed/for-you")
    @Operation(summary = "Get 'For You' feed", description = "Retrieves personalized feed with mixed content")
    @ApiResponse(responseCode = "200", description = "Feed retrieved successfully")
    public ResponseEntity<Page<PostDTO>> getForYouFeed(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("📰 Loading 'For You' feed: page={}, size={}", page, size);

        String userId = getCurrentUserId();
        Pageable pageable = createPageable(page, size);
        Page<PostDTO> feed = communityService.getFeedForYou(userId, pageable);

        return ResponseEntity.ok(feed);
    }

    @GetMapping("/posts/feed/following")
    @Operation(summary = "Get 'Following' feed", description = "Retrieves posts from followed users")
    @ApiResponse(responseCode = "200", description = "Feed retrieved successfully")
    public ResponseEntity<Page<PostDTO>> getFollowingFeed(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("📰 Loading 'Following' feed: page={}, size={}", page, size);

        String userId = getCurrentUserId();
        Pageable pageable = createPageable(page, size);
        Page<PostDTO> feed = communityService.getFeedFollowing(userId, pageable);

        return ResponseEntity.ok(feed);
    }

    @GetMapping("/posts/feed/explore")
    @Operation(summary = "Get 'Explore' feed", description = "Retrieves trending/popular posts")
    @ApiResponse(responseCode = "200", description = "Feed retrieved successfully")
    public ResponseEntity<Page<PostDTO>> getExploreFeed(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("🌟 Loading 'Explore' feed: page={}, size={}", page, size);

        Pageable pageable = createPageable(page, size);
        Page<PostDTO> feed = communityService.getExploreFeed(pageable);

        return ResponseEntity.ok(feed);
    }

    @GetMapping("/posts/category/{category}")
    @Operation(summary = "Get posts by category", description = "Retrieves posts filtered by category")
    @ApiResponse(responseCode = "200", description = "Posts retrieved successfully")
    public ResponseEntity<Page<PostDTO>> getPostsByCategory(
            @Parameter(description = "Post category") @PathVariable PostCategory category,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("📂 Loading posts by category: category={}, page={}", category, page);

        Pageable pageable = createPageable(page, size);
        Page<PostDTO> posts = communityService.getPostsByCategory(category, pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/type/{type}")
    @Operation(summary = "Get posts by type", description = "Retrieves posts filtered by type")
    @ApiResponse(responseCode = "200", description = "Posts retrieved successfully")
    public ResponseEntity<Page<PostDTO>> getPostsByType(
            @Parameter(description = "Post type") @PathVariable PostType type,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("📋 Loading posts by type: type={}, page={}", type, page);

        Pageable pageable = createPageable(page, size);
        Page<PostDTO> posts = communityService.getPostsByType(type, pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/author/{authorId}")
    @Operation(summary = "Get posts by author", description = "Retrieves all posts from a specific user")
    @ApiResponse(responseCode = "200", description = "Posts retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Author not found")
    public ResponseEntity<Page<PostDTO>> getPostsByAuthor(
            @Parameter(description = "Author user ID") @PathVariable String authorId,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("👤 Loading posts by author: authorId={}, page={}", authorId, page);

        String currentUserId = getCurrentUserId();
        Pageable pageable = createPageable(page, size);
        Page<PostDTO> posts = communityService.getPostsByAuthor(authorId, currentUserId, pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/search")
    @Operation(summary = "Search posts", description = "Searches posts by keyword")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    public ResponseEntity<Page<PostDTO>> searchPosts(
            @Parameter(description = "Search keyword") @RequestParam String keyword,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("🔍 Searching posts: keyword='{}', page={}", keyword, page);

        Pageable pageable = createPageable(page, size);
        Page<PostDTO> posts = communityService.searchPosts(keyword, pageable);

        return ResponseEntity.ok(posts);
    }

    @PutMapping("/posts/{postId}")
    @Operation(summary = "Update post", description = "Updates an existing post (author only)")
    @ApiResponse(responseCode = "200", description = "Post updated successfully")
    @ApiResponse(responseCode = "403", description = "Not authorized to update this post")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<PostDTO> updatePost(
            @Parameter(description = "Post ID") @PathVariable Long postId,
            @Valid @RequestBody PostCreateDTO postCreateDTO) {
        logger.info("✏️ Updating post: postId={}", postId);

        String userId = getCurrentUserId();
        PostDTO post = communityService.updatePost(postId, postCreateDTO, userId);

        logger.info("✅ Post updated successfully: postId={}", postId);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/posts/{postId}")
    @Operation(summary = "Delete post", description = "Deletes a post (author only)")
    @ApiResponse(responseCode = "204", description = "Post deleted successfully")
    @ApiResponse(responseCode = "403", description = "Not authorized to delete this post")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "Post ID") @PathVariable Long postId) {
        logger.info("🗑️ Deleting post: postId={}", postId);

        String userId = getCurrentUserId();
        communityService.deletePost(postId, userId);

        logger.info("✅ Post deleted successfully: postId={}", postId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/posts/achievement")
    @Operation(summary = "Create achievement post", description = "Creates an automatic achievement post")
    @ApiResponse(responseCode = "201", description = "Achievement post created successfully")
    public ResponseEntity<PostDTO> createAchievementPost(
            @Parameter(description = "Achievement type") @RequestParam String achievementType,
            @Parameter(description = "Achievement details") @RequestParam String achievementDetails) {
        logger.info("🏆 Creating achievement post: type={}", achievementType);

        String userId = getCurrentUserId();
        PostDTO post = communityService.createAchievementPost(userId, achievementType, achievementDetails);

        logger.info("✅ Achievement post created: postId={}", post.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    // ========================================
    // Comment Operations
    // ========================================

    @PostMapping("/comments")
    @Operation(summary = "Create comment", description = "Creates a comment on a post or replies to another comment")
    @ApiResponse(responseCode = "201", description = "Comment created successfully")
    @ApiResponse(responseCode = "404", description = "Post or parent comment not found")
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CommentCreateDTO commentCreateDTO) {
        logger.info("💬 Creating comment: postId={}", commentCreateDTO.postId());

        String userId = getCurrentUserId();
        CommentDTO comment = communityService.createComment(commentCreateDTO, userId);

        logger.info("✅ Comment created: commentId={}", comment.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/posts/{postId}/comments")
    @Operation(summary = "Get comments", description = "Retrieves all comments for a post with nested replies")
    @ApiResponse(responseCode = "200", description = "Comments retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<Page<CommentDTO>> getComments(
            @Parameter(description = "Post ID") @PathVariable Long postId,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        logger.debug("💬 Loading comments: postId={}, page={}", postId, page);

        String userId = getCurrentUserId();
        Pageable pageable = createPageable(page, size);
        Page<CommentDTO> comments = communityService.getCommentsByPostId(postId, userId, pageable);

        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete comment", description = "Deletes a comment (author only)")
    @ApiResponse(responseCode = "204", description = "Comment deleted successfully")
    @ApiResponse(responseCode = "403", description = "Not authorized to delete this comment")
    @ApiResponse(responseCode = "404", description = "Comment not found")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "Comment ID") @PathVariable Long commentId) {
        logger.info("🗑️ Deleting comment: commentId={}", commentId);

        String userId = getCurrentUserId();
        communityService.deleteComment(commentId, userId);

        logger.info("✅ Comment deleted: commentId={}", commentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/comments/{commentId}/mark-useful")
    @Operation(summary = "Mark comment as useful", description = "Marks a comment as useful (post author only)")
    @ApiResponse(responseCode = "200", description = "Comment marked as useful")
    @ApiResponse(responseCode = "403", description = "Not authorized to mark this comment")
    @ApiResponse(responseCode = "404", description = "Comment not found")
    public ResponseEntity<CommentDTO> markCommentAsUseful(
            @Parameter(description = "Comment ID") @PathVariable Long commentId) {
        logger.info("⭐ Marking comment as useful: commentId={}", commentId);

        String userId = getCurrentUserId();
        CommentDTO comment = communityService.markCommentAsUseful(commentId, userId);

        logger.info("✅ Comment marked as useful: commentId={}", commentId);
        return ResponseEntity.ok(comment);
    }

    // ========================================
    // Reaction Operations
    // ========================================

    @PostMapping("/posts/{postId}/reactions")
    @Operation(summary = "Add reaction to post", description = "Adds or updates a reaction to a post")
    @ApiResponse(responseCode = "204", description = "Reaction added successfully")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<Void> addReactionToPost(
            @Parameter(description = "Post ID") @PathVariable Long postId,
            @Parameter(description = "Reaction type") @RequestParam ReactionType reactionType) {
        logger.info("👍 Adding reaction to post: postId={}, type={}", postId, reactionType);

        String userId = getCurrentUserId();
        communityService.addReactionToPost(postId, reactionType, userId);

        logger.info("✅ Reaction added to post: postId={}", postId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/posts/{postId}/reactions")
    @Operation(summary = "Remove reaction from post", description = "Removes user's reaction from a post")
    @ApiResponse(responseCode = "204", description = "Reaction removed successfully")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<Void> removeReactionFromPost(
            @Parameter(description = "Post ID") @PathVariable Long postId) {
        logger.info("👎 Removing reaction from post: postId={}", postId);

        String userId = getCurrentUserId();
        communityService.removeReactionFromPost(postId, userId);

        logger.info("✅ Reaction removed from post: postId={}", postId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comments/{commentId}/reactions")
    @Operation(summary = "Add reaction to comment", description = "Adds or updates a reaction to a comment")
    @ApiResponse(responseCode = "204", description = "Reaction added successfully")
    @ApiResponse(responseCode = "404", description = "Comment not found")
    public ResponseEntity<Void> addReactionToComment(
            @Parameter(description = "Comment ID") @PathVariable Long commentId,
            @Parameter(description = "Reaction type") @RequestParam ReactionType reactionType) {
        logger.info("👍 Adding reaction to comment: commentId={}, type={}", commentId, reactionType);

        String userId = getCurrentUserId();
        communityService.addReactionToComment(commentId, reactionType, userId);

        logger.info("✅ Reaction added to comment: commentId={}", commentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comments/{commentId}/reactions")
    @Operation(summary = "Remove reaction from comment", description = "Removes user's reaction from a comment")
    @ApiResponse(responseCode = "204", description = "Reaction removed successfully")
    @ApiResponse(responseCode = "404", description = "Comment not found")
    public ResponseEntity<Void> removeReactionFromComment(
            @Parameter(description = "Comment ID") @PathVariable Long commentId) {
        logger.info("👎 Removing reaction from comment: commentId={}", commentId);

        String userId = getCurrentUserId();
        communityService.removeReactionFromComment(commentId, userId);

        logger.info("✅ Reaction removed from comment: commentId={}", commentId);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // Follow Operations
    // ========================================

    @PostMapping("/users/{userId}/follow")
    @Operation(summary = "Follow user", description = "Follows another user")
    @ApiResponse(responseCode = "204", description = "User followed successfully")
    @ApiResponse(responseCode = "400", description = "Cannot follow yourself or already following")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<Void> followUser(
            @Parameter(description = "User ID to follow") @PathVariable String userId) {
        logger.info("👥 Following user: userId={}", userId);

        String followerId = getCurrentUserId();
        communityService.followUser(userId, followerId);

        logger.info("✅ User followed: userId={}", userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{userId}/follow")
    @Operation(summary = "Unfollow user", description = "Unfollows a user")
    @ApiResponse(responseCode = "204", description = "User unfollowed successfully")
    @ApiResponse(responseCode = "400", description = "Not following this user")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<Void> unfollowUser(
            @Parameter(description = "User ID to unfollow") @PathVariable String userId) {
        logger.info("👥 Unfollowing user: userId={}", userId);

        String followerId = getCurrentUserId();
        communityService.unfollowUser(userId, followerId);

        logger.info("✅ User unfollowed: userId={}", userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{userId}/is-following")
    @Operation(summary = "Check if following", description = "Checks if current user follows another user")
    @ApiResponse(responseCode = "200", description = "Following status retrieved")
    public ResponseEntity<Boolean> isFollowing(
            @Parameter(description = "User ID to check") @PathVariable String userId) {
        logger.debug("👥 Checking if following: userId={}", userId);

        String followerId = getCurrentUserId();
        boolean following = communityService.isFollowing(followerId, userId);

        return ResponseEntity.ok(following);
    }

    @GetMapping("/users/{userId}/followers-count")
    @Operation(summary = "Get follower count", description = "Gets the number of followers for a user")
    @ApiResponse(responseCode = "200", description = "Follower count retrieved")
    public ResponseEntity<Long> getFollowerCount(
            @Parameter(description = "User ID") @PathVariable String userId) {
        logger.debug("👥 Getting follower count: userId={}", userId);

        long count = communityService.getFollowerCount(userId);

        return ResponseEntity.ok(count);
    }

    @GetMapping("/users/{userId}/following-count")
    @Operation(summary = "Get following count", description = "Gets the number of users a user is following")
    @ApiResponse(responseCode = "200", description = "Following count retrieved")
    public ResponseEntity<Long> getFollowingCount(
            @Parameter(description = "User ID") @PathVariable String userId) {
        logger.debug("👥 Getting following count: userId={}", userId);

        long count = communityService.getFollowingCount(userId);

        return ResponseEntity.ok(count);
    }

    // ========================================
    // Report Operations
    // ========================================

    @PostMapping("/posts/{postId}/report")
    @Operation(summary = "Report post", description = "Reports a post for moderation")
    @ApiResponse(responseCode = "204", description = "Post reported successfully")
    @ApiResponse(responseCode = "400", description = "Already reported this post")
    @ApiResponse(responseCode = "404", description = "Post not found")
    public ResponseEntity<Void> reportPost(
            @Parameter(description = "Post ID") @PathVariable Long postId,
            @Valid @RequestBody ReportCreateDTO reportCreateDTO) {
        logger.info("🚩 Reporting post: postId={}, type={}", postId, reportCreateDTO.reportType());

        String userId = getCurrentUserId();
        communityService.reportPost(postId, reportCreateDTO, userId);

        logger.info("✅ Post reported: postId={}", postId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comments/{commentId}/report")
    @Operation(summary = "Report comment", description = "Reports a comment for moderation")
    @ApiResponse(responseCode = "204", description = "Comment reported successfully")
    @ApiResponse(responseCode = "400", description = "Already reported this comment")
    @ApiResponse(responseCode = "404", description = "Comment not found")
    public ResponseEntity<Void> reportComment(
            @Parameter(description = "Comment ID") @PathVariable Long commentId,
            @Valid @RequestBody ReportCreateDTO reportCreateDTO) {
        logger.info("🚩 Reporting comment: commentId={}, type={}", commentId, reportCreateDTO.reportType());

        String userId = getCurrentUserId();
        communityService.reportComment(commentId, reportCreateDTO, userId);

        logger.info("✅ Comment reported: commentId={}", commentId);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // User Profile Operations
    // ========================================

    @GetMapping("/users/{userId}/profile")
    @Operation(summary = "Get user profile", description = "Gets community profile for a user")
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserSimpleDTO> getUserProfile(
            @Parameter(description = "User ID") @PathVariable String userId) {
        logger.debug("👤 Getting user profile: userId={}", userId);

        String currentUserId = getCurrentUserId();
        UserSimpleDTO profile = communityService.getUserProfile(userId, currentUserId);

        return ResponseEntity.ok(profile);
    }

    // ========================================
    // Helper Methods
    // ========================================

    /**
     * Gets the currently authenticated user's ID from SecurityContext
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Usuário não autenticado");
        }
        return authentication.getName();
    }

    /**
     * Creates a Pageable with validation
     */
    private Pageable createPageable(int page, int size) {
        int validatedSize = Math.min(size, MAX_PAGE_SIZE);
        if (validatedSize <= 0) {
            validatedSize = DEFAULT_PAGE_SIZE;
        }
        return PageRequest.of(page, validatedSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
