package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.CommunityService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommunityServiceImpl implements CommunityService {

    private static final Logger logger = LoggerFactory.getLogger(CommunityServiceImpl.class);
    private static final int MAX_POSTS_PER_DAY = 10;

    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final FollowRepository followRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public CommunityServiceImpl(
            PostRepository postRepository,
            PostImageRepository postImageRepository,
            CommentRepository commentRepository,
            ReactionRepository reactionRepository,
            FollowRepository followRepository,
            ReportRepository reportRepository,
            UserRepository userRepository
    ) {
        this.postRepository = postRepository;
        this.postImageRepository = postImageRepository;
        this.commentRepository = commentRepository;
        this.reactionRepository = reactionRepository;
        this.followRepository = followRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    // ========================================
    // Post Operations
    // ========================================

    @Override
    @Transactional
    public PostDTO createPost(PostCreateDTO dto, String userId) {
        logger.info("Creating post: userId={}, type={}, category={}", userId, dto.type(), dto.category());

        User author = findUserOrThrow(userId);

        // Check daily post limit
        long postsToday = postRepository.countPostsCreatedTodayByUser(userId);
        if (postsToday >= MAX_POSTS_PER_DAY) {
            logger.warn("User exceeded daily post limit: userId={}, postsToday={}", userId, postsToday);
            throw new BusinessException("Limite diário de posts atingido (" + MAX_POSTS_PER_DAY + " posts/dia)");
        }

        // Create post
        Post post = new Post();
        post.setAuthor(author);
        post.setType(dto.type());
        post.setCategory(dto.category());
        post.setContent(dto.content());
        post.setHashtags(dto.hashtags());
        post.setRelatedLessonId(dto.relatedLessonId());
        post.setRelatedGoalId(dto.relatedGoalId());
        post.setStatus(PostStatus.ACTIVE);

        postRepository.save(post);

        // Save images if provided
        if (dto.imageUrls() != null && !dto.imageUrls().isEmpty()) {
            savePostImages(post, dto.imageUrls());
        }

        logger.info("✅ Post created successfully: postId={}, userId={}", post.getId(), userId);

        return mapPostToDTO(post, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDTO getPostById(Long postId, String currentUserId) {
        logger.debug("Fetching post: postId={}, currentUserId={}", postId, currentUserId);

        Post post = findPostOrThrow(postId);

        if (post.getStatus() != PostStatus.ACTIVE) {
            logger.warn("Attempted to access non-active post: postId={}, status={}", postId, post.getStatus());
            throw new EntityNotFoundException("Post não disponível");
        }

        return mapPostToDTO(post, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getFeedForYou(String userId, Pageable pageable) {
        logger.debug("Loading 'For You' feed: userId={}", userId);

        Page<Post> posts = postRepository.findAllActivePosts(pageable);

        return posts.map(post -> mapPostToDTO(post, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getFeedFollowing(String userId, Pageable pageable) {
        logger.debug("Loading 'Following' feed: userId={}", userId);

        Page<Post> posts = postRepository.findPostsByFollowedUsers(userId, pageable);

        return posts.map(post -> mapPostToDTO(post, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getExploreFeed(Pageable pageable) {
        logger.debug("Loading 'Explore' feed (trending)");

        Page<Post> posts = postRepository.findTrendingPosts(pageable);

        return posts.map(post -> mapPostToDTO(post, null));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getPostsByCategory(PostCategory category, Pageable pageable) {
        logger.debug("Loading posts by category: category={}", category);

        Page<Post> posts = postRepository.findByCategory(category, pageable);

        return posts.map(post -> mapPostToDTO(post, null));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getPostsByType(PostType type, Pageable pageable) {
        logger.debug("Loading posts by type: type={}", type);

        Page<Post> posts = postRepository.findByType(type, pageable);

        return posts.map(post -> mapPostToDTO(post, null));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getPostsByAuthor(String authorId, String currentUserId, Pageable pageable) {
        logger.debug("Loading posts by author: authorId={}, currentUserId={}", authorId, currentUserId);

        // Verify author exists
        findUserOrThrow(authorId);

        Page<Post> posts = postRepository.findByAuthorId(authorId, pageable);

        return posts.map(post -> mapPostToDTO(post, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> searchPosts(String keyword, Pageable pageable) {
        logger.debug("Searching posts: keyword={}", keyword);

        Page<Post> posts = postRepository.searchPosts(keyword, pageable);

        return posts.map(post -> mapPostToDTO(post, null));
    }

    @Override
    @Transactional
    public void deletePost(Long postId, String userId) {
        logger.info("Deleting post: postId={}, userId={}", postId, userId);

        Post post = findPostOrThrow(postId);

        // Verify ownership
        if (!post.getAuthor().getId().equals(String.valueOf(userId))) {
            logger.warn("User attempted to delete another user's post: postId={}, userId={}, authorId={}",
                    postId, userId, post.getAuthor().getId());
            throw new BusinessException("Você não tem permissão para deletar este post");
        }

        // Delete associated data
        postImageRepository.deleteByPostId(postId);
        reactionRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);

        // Delete post
        postRepository.delete(post);

        logger.info("✅ Post deleted successfully: postId={}", postId);
    }

    @Override
    @Transactional
    public PostDTO updatePost(Long postId, PostCreateDTO dto, String userId) {
        logger.info("Updating post: postId={}, userId={}", postId, userId);

        Post post = findPostOrThrow(postId);

        // Verify ownership
        if (!post.getAuthor().getId().equals(String.valueOf(userId))) {
            logger.warn("User attempted to update another user's post: postId={}, userId={}", postId, userId);
            throw new BusinessException("Você não tem permissão para editar este post");
        }

        // Update fields
        if (dto.content() != null) {
            post.setContent(dto.content());
        }
        if (dto.hashtags() != null) {
            post.setHashtags(dto.hashtags());
        }
        if (dto.category() != null) {
            post.setCategory(dto.category());
        }

        postRepository.save(post);

        // Update images if provided
        if (dto.imageUrls() != null) {
            postImageRepository.deleteByPostId(postId);
            savePostImages(post, dto.imageUrls());
        }

        logger.info("✅ Post updated successfully: postId={}", postId);

        return mapPostToDTO(post, userId);
    }

    @Override
    @Transactional
    public PostDTO createAchievementPost(String userId, String achievementType, String achievementDetails) {
        logger.info("Creating achievement post: userId={}, type={}", userId, achievementType);

        User author = findUserOrThrow(userId);

        String content = String.format("🎉 Acabei de conquistar: %s! %s", achievementType, achievementDetails);

        Post post = new Post();
        post.setAuthor(author);
        post.setType(PostType.ACHIEVEMENT);
        post.setCategory(PostCategory.CONQUISTAS);
        post.setContent(content);
        post.setStatus(PostStatus.ACTIVE);

        postRepository.save(post);

        logger.info("✅ Achievement post created: postId={}, userId={}", post.getId(), userId);

        return mapPostToDTO(post, userId);
    }

    // ========================================
    // Comment Operations
    // ========================================

    @Override
    @Transactional
    public CommentDTO createComment(CommentCreateDTO dto, String userId) {
        logger.info("Creating comment: postId={}, userId={}, isReply={}", 
                dto.postId(), userId, dto.parentId() != null);

        User author = findUserOrThrow(userId);
        Post post = findPostOrThrow(dto.postId());

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setContent(dto.content());

        if (dto.parentId() != null) {
            Comment parent = findCommentOrThrow(dto.parentId());
            comment.setParent(parent);
        }

        commentRepository.save(comment);

        // Update post comment count
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        logger.info("✅ Comment created: commentId={}, postId={}", comment.getId(), dto.postId());

        return mapCommentToDTO(comment, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentDTO> getCommentsByPostId(Long postId, String currentUserId, Pageable pageable) {
        logger.debug("Loading comments for post: postId={}", postId);

        // Verify post exists
        findPostOrThrow(postId);

        Page<Comment> comments = commentRepository.findTopLevelCommentsByPostId(postId, pageable);

        return comments.map(comment -> mapCommentWithReplies(comment, currentUserId));
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String userId) {
        logger.info("Deleting comment: commentId={}, userId={}", commentId, userId);

        Comment comment = findCommentOrThrow(commentId);

        // Verify ownership
        if (!comment.getAuthor().getId().equals(String.valueOf(userId))) {
            logger.warn("User attempted to delete another user's comment: commentId={}, userId={}", 
                    commentId, userId);
            throw new BusinessException("Você não tem permissão para deletar este comentário");
        }

        // Delete reactions
        reactionRepository.deleteByCommentId(commentId);

        // Delete comment
        commentRepository.delete(comment);

        // Update post comment count
        Post post = comment.getPost();
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);

        logger.info("✅ Comment deleted: commentId={}", commentId);
    }

    @Override
    @Transactional
    public CommentDTO markCommentAsUseful(Long commentId, String postAuthorId) {
        logger.info("Marking comment as useful: commentId={}, postAuthorId={}", commentId, postAuthorId);

        Comment comment = findCommentOrThrow(commentId);

        // Verify that user is post author
        if (!comment.getPost().getAuthor().getId().equals(String.valueOf(postAuthorId))) {
            logger.warn("Non-author attempted to mark comment as useful: commentId={}, userId={}", 
                    commentId, postAuthorId);
            throw new BusinessException("Apenas o autor do post pode marcar comentários como úteis");
        }

        comment.setMarkedAsUseful(true);
        commentRepository.save(comment);

        logger.info("✅ Comment marked as useful: commentId={}", commentId);

        return mapCommentToDTO(comment, postAuthorId);
    }

    // ========================================
    // Reaction Operations
    // ========================================

    @Override
    @Transactional
    public void addReactionToPost(Long postId, ReactionType reactionType, String userId) {
        logger.info("Adding reaction to post: postId={}, userId={}, type={}", postId, userId, reactionType);

        User user = findUserOrThrow(userId);
        Post post = findPostOrThrow(postId);

        // Check if user already reacted
        Optional<Reaction> existingReaction = reactionRepository.findByUserIdAndPostId(userId, postId);

        if (existingReaction.isPresent()) {
            // Update existing reaction
            Reaction reaction = existingReaction.get();
            reaction.setReactionType(reactionType);
            reactionRepository.save(reaction);
            logger.debug("Reaction updated: postId={}, userId={}", postId, userId);
        } else {
            // Create new reaction
            Reaction reaction = new Reaction(user, post, reactionType);
            reactionRepository.save(reaction);

            // Update post reaction count
            post.setReactionCount(post.getReactionCount() + 1);
            postRepository.save(post);

            logger.info("✅ Reaction added to post: postId={}, userId={}", postId, userId);
        }
    }

    @Override
    @Transactional
    public void removeReactionFromPost(Long postId, String userId) {
        logger.info("Removing reaction from post: postId={}, userId={}", postId, userId);

        Post post = findPostOrThrow(postId);

        if (reactionRepository.existsByUserIdAndPostId(userId, postId)) {
            reactionRepository.deleteByUserIdAndPostId(userId, postId);

            // Update post reaction count
            post.setReactionCount(Math.max(0, post.getReactionCount() - 1));
            postRepository.save(post);

            logger.info("✅ Reaction removed from post: postId={}, userId={}", postId, userId);
        }
    }

    @Override
    @Transactional
    public void addReactionToComment(Long commentId, ReactionType reactionType, String userId) {
        logger.info("Adding reaction to comment: commentId={}, userId={}, type={}", 
                commentId, userId, reactionType);

        User user = findUserOrThrow(userId);
        Comment comment = findCommentOrThrow(commentId);

        // Check if user already reacted
        Optional<Reaction> existingReaction = reactionRepository.findByUserIdAndCommentId(userId, commentId);

        if (existingReaction.isPresent()) {
            // Update existing reaction
            Reaction reaction = existingReaction.get();
            reaction.setReactionType(reactionType);
            reactionRepository.save(reaction);
            logger.debug("Reaction updated: commentId={}, userId={}", commentId, userId);
        } else {
            // Create new reaction
            Reaction reaction = new Reaction(user, comment, reactionType);
            reactionRepository.save(reaction);

            // Update comment reaction count
            comment.setReactionCount(comment.getReactionCount() + 1);
            commentRepository.save(comment);

            logger.info("✅ Reaction added to comment: commentId={}, userId={}", commentId, userId);
        }
    }

    @Override
    @Transactional
    public void removeReactionFromComment(Long commentId, String userId) {
        logger.info("Removing reaction from comment: commentId={}, userId={}", commentId, userId);

        Comment comment = findCommentOrThrow(commentId);

        if (reactionRepository.existsByUserIdAndCommentId(userId, commentId)) {
            reactionRepository.deleteByUserIdAndCommentId(userId, commentId);

            // Update comment reaction count
            comment.setReactionCount(Math.max(0, comment.getReactionCount() - 1));
            commentRepository.save(comment);

            logger.info("✅ Reaction removed from comment: commentId={}, userId={}", commentId, userId);
        }
    }

    // ========================================
    // Follow Operations
    // ========================================

    @Override
    @Transactional
    public void followUser(String followedId, String followerId) {
        logger.info("User following: followerId={}, followedId={}", followerId, followedId);

        if (followerId.equals(followedId)) {
            throw new BusinessException("Você não pode seguir a si mesmo");
        }

        User follower = findUserOrThrow(followerId);
        User followed = findUserOrThrow(followedId);

        // Check if already following
        if (followRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            logger.warn("User already following: followerId={}, followedId={}", followerId, followedId);
            throw new BusinessException("Você já segue este usuário");
        }

        Follow follow = new Follow(follower, followed);
        followRepository.save(follow);

        logger.info("✅ User followed successfully: followerId={}, followedId={}", followerId, followedId);
    }

    @Override
    @Transactional
    public void unfollowUser(String followedId, String followerId) {
        logger.info("User unfollowing: followerId={}, followedId={}", followerId, followedId);

        if (!followRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            logger.warn("User attempted to unfollow non-followed user: followerId={}, followedId={}", 
                    followerId, followedId);
            throw new BusinessException("Você não segue este usuário");
        }

        followRepository.deleteByFollowerIdAndFollowedId(followerId, followedId);

        logger.info("✅ User unfollowed successfully: followerId={}, followedId={}", followerId, followedId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(String followerId, String followedId) {
        return followRepository.existsByFollowerIdAndFollowedId(followerId, followedId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFollowerCount(String userId) {
        return followRepository.countByFollowedId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFollowingCount(String userId) {
        return followRepository.countByFollowerId(userId);
    }

    // ========================================
    // Report Operations
    // ========================================

    @Override
    @Transactional
    public void reportPost(Long postId, ReportCreateDTO dto, String userId) {
        logger.info("Reporting post: postId={}, userId={}, type={}", postId, userId, dto.reportType());

        User reporter = findUserOrThrow(userId);
        Post post = findPostOrThrow(postId);

        // Check if user already reported this post
        if (reportRepository.existsByReporterIdAndPostId(userId, postId)) {
            logger.warn("User already reported this post: userId={}, postId={}", userId, postId);
            throw new BusinessException("Você já denunciou este post");
        }

        Report report = new Report(reporter, post, dto.reportType(), dto.description());
        reportRepository.save(report);

        logger.info("✅ Post reported: reportId={}, postId={}", report.getId(), postId);
    }

    @Override
    @Transactional
    public void reportComment(Long commentId, ReportCreateDTO dto, String userId) {
        logger.info("Reporting comment: commentId={}, userId={}, type={}", 
                commentId, userId, dto.reportType());

        User reporter = findUserOrThrow(userId);
        Comment comment = findCommentOrThrow(commentId);

        // Check if user already reported this comment
        if (reportRepository.existsByReporterIdAndCommentId(userId, commentId)) {
            logger.warn("User already reported this comment: userId={}, commentId={}", userId, commentId);
            throw new BusinessException("Você já denunciou este comentário");
        }

        Report report = new Report(reporter, comment, dto.reportType(), dto.description());
        reportRepository.save(report);

        logger.info("✅ Comment reported: reportId={}, commentId={}", report.getId(), commentId);
    }

    // ========================================
    // User Profile Operations
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public UserSimpleDTO getUserProfile(String userId, String currentUserId) {
        logger.debug("Loading user profile: userId={}, currentUserId={}", userId, currentUserId);

        User user = findUserOrThrow(userId);

        return new UserSimpleDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                null, // photoUrl will be added to User model in future
                null, // bio will be added to User model in future
                user.getLevel(),
                user.getTotalFinPoints(),
                (int) followRepository.countByFollowedId(userId),
                (int) followRepository.countByFollowerId(userId)
        );
    }

    // ========================================
    // Helper Methods
    // ========================================

    private void savePostImages(Post post, List<String> imageUrls) {
        int order = 0;
        for (String imageUrl : imageUrls) {
            PostImage postImage = new PostImage(post, imageUrl, order++);
            postImageRepository.save(postImage);
        }
        logger.debug("Saved {} images for post {}", imageUrls.size(), post.getId());
    }

    private PostDTO mapPostToDTO(Post post, String currentUserId) {
        // Load images
        List<PostImage> images = postImageRepository.findByPostIdOrderByImageOrderAsc(post.getId());
        List<String> imageUrls = images.stream().map(PostImage::getImageUrl).collect(Collectors.toList());

        // Load reactions by type
        Map<String, Integer> reactionsByType = new HashMap<>();
        for (ReactionType type : ReactionType.values()) {
            long count = reactionRepository.countByPostIdAndReactionType(post.getId(), type);
            if (count > 0) {
                reactionsByType.put(type.name(), (int) count);
            }
        }

        // Check if current user reacted and follows author
        Boolean currentUserReacted = null;
        Boolean currentUserFollowsAuthor = null;
        if (currentUserId != null) {
            currentUserReacted = reactionRepository.existsByUserIdAndPostId(currentUserId, post.getId());
            currentUserFollowsAuthor = followRepository.existsByFollowerIdAndFollowedId(
                    currentUserId, post.getAuthor().getId());
        }

        return new PostDTO(
                post.getId(),
                mapUserToSimpleDTO(post.getAuthor()),
                post.getType(),
                post.getCategory(),
                post.getContent(),
                post.getHashtags(),
                imageUrls,
                post.getRelatedLessonId(),
                post.getRelatedGoalId(),
                post.getStatus(),
                post.getReactionCount(),
                post.getCommentCount(),
                post.getShareCount(),
                reactionsByType,
                currentUserReacted,
                currentUserFollowsAuthor,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private CommentDTO mapCommentToDTO(Comment comment, String currentUserId) {
        // Check if current user reacted
        Boolean currentUserReacted = null;
        if (currentUserId != null) {
            currentUserReacted = reactionRepository.existsByUserIdAndCommentId(
                    currentUserId, comment.getId());
        }

        return new CommentDTO(
                comment.getId(),
                comment.getPost().getId(),
                mapUserToSimpleDTO(comment.getAuthor()),
                comment.getContent(),
                comment.getMarkedAsUseful(),
                comment.getReactionCount(),
                currentUserReacted,
                null, // replies will be set in mapCommentWithReplies
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }

    private CommentDTO mapCommentWithReplies(Comment comment, String currentUserId) {
        // Check if current user reacted
        Boolean currentUserReacted = null;
        if (currentUserId != null) {
            currentUserReacted = reactionRepository.existsByUserIdAndCommentId(
                    currentUserId, comment.getId());
        }

        // Load replies
        List<Comment> replies = commentRepository.findRepliesByParentId(comment.getId());
        List<CommentDTO> replyDTOs = replies.stream()
                .map(reply -> mapCommentToDTO(reply, currentUserId))
                .collect(Collectors.toList());

        return new CommentDTO(
                comment.getId(),
                comment.getPost().getId(),
                mapUserToSimpleDTO(comment.getAuthor()),
                comment.getContent(),
                comment.getMarkedAsUseful(),
                comment.getReactionCount(),
                currentUserReacted,
                replyDTOs,
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }

    private UserSimpleDTO mapUserToSimpleDTO(User user) {
        return new UserSimpleDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                null, // photoUrl will be added to User model in future
                null, // bio will be added to User model in future
                user.getLevel(),
                user.getTotalFinPoints(),
                null, // followerCount not needed in this context
                null  // followingCount not needed in this context
        );
    }

    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> {
                    logger.warn("Post not found: {}", postId);
                    return new EntityNotFoundException("Post não encontrado: " + postId);
                });
    }

    private Comment findCommentOrThrow(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> {
                    logger.warn("Comment not found: {}", commentId);
                    return new EntityNotFoundException("Comentário não encontrado: " + commentId);
                });
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(String.valueOf(userId))
                .orElseThrow(() -> {
                    logger.warn("User not found: {}", userId);
                    return new EntityNotFoundException("Usuário não encontrado: " + userId);
                });
    }
}
