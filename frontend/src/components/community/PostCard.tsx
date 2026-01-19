import React, { useState } from 'react';
import styled from 'styled-components';
import type { PostDTO } from '../../services/communityService';
import {
  ReactionType,
  addReactionToPost,
  removeReactionFromPost,
  getReactionIcon,
  getReactionLabel,
  getCategoryLabel,
  formatTimeAgo
} from '../../services/communityService';
import { useToast } from '../../hooks/useToast';

interface PostCardProps {
  post: PostDTO;
  onCommentClick: (postId: number) => void;
  onPostUpdate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onCommentClick, onPostUpdate }) => {
  const { addToast } = useToast();
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const handleReaction = async (type: ReactionType) => {
    if (isReacting) return;

    setIsReacting(true);
    try {
      if (post.currentUserReacted) {
        await removeReactionFromPost(post.id);
      }
      await addReactionToPost(post.id, type);
      onPostUpdate();
      setShowReactionMenu(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
      addToast('Erro ao reagir ao post', 'error');
    } finally {
      setIsReacting(false);
    }
  };

  const reactionTypes: ReactionType[] = ['LIKE', 'CELEBRATE', 'INSIGHT', 'INSPIRING', 'LOVE'];

  return (
    <Card>
      <CardHeader>
        <UserInfo>
          <Avatar>
            {post.author.photoUrl ? (
              <img src={post.author.photoUrl} alt={post.author.name} />
            ) : (
              <DefaultAvatar>{post.author.name.charAt(0).toUpperCase()}</DefaultAvatar>
            )}
          </Avatar>
          <UserDetails>
            <UserName>{post.author.name}</UserName>
            <PostMeta>
              <CategoryBadge>{getCategoryLabel(post.category)}</CategoryBadge>
              <Separator>•</Separator>
              <TimeAgo>{formatTimeAgo(post.createdAt)}</TimeAgo>
            </PostMeta>
          </UserDetails>
        </UserInfo>
        {post.type === 'ACHIEVEMENT' && <AchievementBadge>🏆</AchievementBadge>}
      </CardHeader>

      <CardContent>
        <PostText>{post.content}</PostText>
        {post.imageUrls && post.imageUrls.length > 0 && (
          <PostImages>
            {post.imageUrls.map((url, index) => (
              <PostImage key={index} src={url} alt={`Post image ${index + 1}`} />
            ))}
          </PostImages>
        )}
        {post.hashtags && post.hashtags.trim().length > 0 && (
          <Hashtags>
            {post.hashtags.split(',').map((tag, index) => (
              <Hashtag key={index}>#{tag.trim()}</Hashtag>
            ))}
          </Hashtags>
        )}
      </CardContent>

      <CardFooter>
        <Stats>
          {Object.entries(post.reactionsByType).map(([type, count]) => (
            <StatItem key={type}>
              <span>{getReactionIcon(type as ReactionType)}</span>
              <span>{count}</span>
            </StatItem>
          ))}
          {post.reactionCount > 0 && <Separator>•</Separator>}
          <StatItem>{post.commentCount} comentários</StatItem>
        </Stats>

        <Actions>
          <ActionButton
            onClick={() => setShowReactionMenu(!showReactionMenu)}
            $active={post.currentUserReacted}
            disabled={isReacting}
          >
            {post.currentUserReacted ? '❤️' : '👍'} Reagir
          </ActionButton>
          <ActionButton onClick={() => onCommentClick(post.id)}>
            💬 Comentar
          </ActionButton>
        </Actions>

        {showReactionMenu && (
          <ReactionMenu>
            {reactionTypes.map((type) => (
              <ReactionOption
                key={type}
                onClick={() => handleReaction(type)}
                title={getReactionLabel(type)}
              >
                {getReactionIcon(type)}
              </ReactionOption>
            ))}
          </ReactionMenu>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;

// Styled Components
const Card = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const CategoryBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.textMedium};
`;

const TimeAgo = styled.span`
  color: ${({ theme }) => theme.colors.textMedium};
`;

const AchievementBadge = styled.div`
  font-size: 24px;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const PostText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 12px 0;
  white-space: pre-wrap;
`;

const PostImages = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  max-height: 300px;
`;

const Hashtags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Hashtag = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CardFooter = styled.div`
  position: relative;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary + '20' : 'transparent'};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textMedium};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReactionMenu = styled.div`
  position: absolute;
  bottom: 60px;
  left: 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 50px;
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const ReactionOption = styled.button`
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;
