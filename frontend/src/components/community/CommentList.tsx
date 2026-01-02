import React, { useState } from 'react';
import styled from 'styled-components';
import type { CommentDTO, CommentCreateDTO } from '../../services/communityService';
import {
  createComment,
  deleteComment,
  ReactionType,
  addReactionToComment,
  removeReactionFromComment,
  getReactionIcon,
  formatTimeAgo
} from '../../services/communityService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

interface CommentListProps {
  postId: number;
  comments: CommentDTO[];
  onCommentsUpdate: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ postId, comments, onCommentsUpdate }) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (parentId?: number) => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const commentData: CommentCreateDTO = {
        postId,
        content: commentText.trim(),
        parentId
      };

      await createComment(commentData);
      setCommentText('');
      setReplyingTo(null);
      onCommentsUpdate();
      addToast('Comentário adicionado!', 'success');
    } catch (error) {
      console.error('Error creating comment:', error);
      addToast('Erro ao adicionar comentário', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Deseja realmente excluir este comentário?')) return;

    try {
      await deleteComment(commentId);
      onCommentsUpdate();
      addToast('Comentário excluído', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      addToast('Erro ao excluir comentário', 'error');
    }
  };

  const handleReaction = async (commentId: number, type: ReactionType, hasReacted: boolean) => {
    try {
      if (hasReacted) {
        await removeReactionFromComment(commentId);
      } else {
        await addReactionToComment(commentId, type);
      }
      onCommentsUpdate();
    } catch (error) {
      console.error('Error reacting to comment:', error);
      addToast('Erro ao reagir ao comentário', 'error');
    }
  };

  const renderComment = (comment: CommentDTO, isReply: boolean = false) => {
    const isAuthor = user?.uid === String(comment.author.id);

    return (
      <CommentContainer key={comment.id} $isReply={isReply}>
        <CommentHeader>
          <Avatar>
            {comment.author.photoUrl ? (
              <img src={comment.author.photoUrl} alt={comment.author.name} />
            ) : (
              <DefaultAvatar>{comment.author.name.charAt(0).toUpperCase()}</DefaultAvatar>
            )}
          </Avatar>
          <CommentBody>
            <CommentMeta>
              <AuthorName>{comment.author.name}</AuthorName>
              <TimeAgo>{formatTimeAgo(comment.createdAt)}</TimeAgo>
              {comment.markedAsUseful && <UsefulBadge>⭐ Útil</UsefulBadge>}
            </CommentMeta>
            <CommentText>{comment.content}</CommentText>
            <CommentActions>
              <ActionButton
                onClick={() => handleReaction(comment.id, 'LIKE', comment.currentUserReacted || false)}
              >
                {comment.currentUserReacted ? '❤️' : '👍'} {comment.reactionCount > 0 && comment.reactionCount}
              </ActionButton>
              {!isReply && (
                <ActionButton onClick={() => setReplyingTo(comment.id)}>
                  💬 Responder
                </ActionButton>
              )}
              {isAuthor && (
                <ActionButton onClick={() => handleDeleteComment(comment.id)}>
                  🗑️ Excluir
                </ActionButton>
              )}
            </CommentActions>

            {replyingTo === comment.id && (
              <ReplyBox>
                <ReplyInput
                  placeholder="Escreva sua resposta..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isSubmitting}
                />
                <ReplyActions>
                  <CancelButton onClick={() => { setReplyingTo(null); setCommentText(''); }}>
                    Cancelar
                  </CancelButton>
                  <SubmitButton
                    onClick={() => handleSubmitComment(comment.id)}
                    disabled={!commentText.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Responder'}
                  </SubmitButton>
                </ReplyActions>
              </ReplyBox>
            )}
          </CommentBody>
        </CommentHeader>

        {comment.replies && comment.replies.length > 0 && (
          <Replies>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </Replies>
        )}
      </CommentContainer>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Comentários ({comments.length})</Title>
      </Header>

      <NewCommentBox>
        <NewCommentInput
          placeholder="Adicione um comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        />
        <SubmitButton
          onClick={() => handleSubmitComment()}
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Comentar'}
        </SubmitButton>
      </NewCommentBox>

      <CommentsContainer>
        {comments.length === 0 ? (
          <EmptyState>Seja o primeiro a comentar!</EmptyState>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </CommentsContainer>
    </Container>
  );
};

export default CommentList;

// Styled Components
const Container = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 12px;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const NewCommentBox = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const NewCommentInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
  height: fit-content;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 16px;
`;

const CommentContainer = styled.div<{ $isReply?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $isReply }) => $isReply && `
    margin-left: 48px;
    margin-top: 12px;
  `}
`;

const CommentHeader = styled.div`
  display: flex;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

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
  font-size: 16px;
  font-weight: bold;
`;

const CommentBody = styled.div`
  flex: 1;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const TimeAgo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const UsefulBadge = styled.span`
  font-size: 12px;
  background: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  padding: 2px 8px;
  border-radius: 12px;
`;

const CommentText = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textDark};
  white-space: pre-wrap;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMedium};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }
`;

const ReplyBox = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ReplyActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 6px 16px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMedium};
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.textLight};
  }
`;

const Replies = styled.div`
  margin-top: 8px;
`;
