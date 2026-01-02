import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { PostDTO, PostCategory, PostType, PostCreateDTO, PaginatedResponse } from '../services/communityService';
import {
  getForYouFeed,
  getFollowingFeed,
  getExploreFeed,
  getPostsByCategory,
  createPost,
  PostCategory as PostCategoryEnum,
  PostType as PostTypeEnum
} from '../services/communityService';
import PostCard from '../components/community/PostCard';
import CommentList from '../components/community/CommentList';
import { useToast } from '../hooks/useToast';
import type { CommentCreateDTO, CommentDTO } from '../services/communityService';
import { getCommentsByPostId, createComment } from '../services/communityService';

type FeedType = 'for-you' | 'following' | 'explore';

const CommunityPage: React.FC = () => {
  const { addToast } = useToast();
  const [feedType, setFeedType] = useState<FeedType>('for-you');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [feedType, selectedCategory]);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      let response: PaginatedResponse<PostDTO>;

      if (selectedCategory) {
        response = await getPostsByCategory(selectedCategory);
      } else {
        switch (feedType) {
          case 'following':
            response = await getFollowingFeed();
            break;
          case 'explore':
            response = await getExploreFeed();
            break;
          default:
            response = await getForYouFeed();
        }
      }

      setPosts(response.content);
    } catch (error) {
      console.error('Error loading feed:', error);
      addToast('Erro ao carregar feed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedPostForComments, setSelectedPostForComments] = useState<number | null>(null);

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleCommentClick = (postId: number) => {
    setSelectedPostForComments(postId);
  };

  const handlePostUpdate = () => {
    loadFeed();
  };

  return (
    <Container>
      <Header>
        <Title>Comunidade</Title>
        <CreateButton onClick={handleCreatePost}>
          ✍️ Criar Post
        </CreateButton>
      </Header>

      <FeedTabs>
        <Tab
          $active={feedType === 'for-you' && !selectedCategory}
          onClick={() => { setFeedType('for-you'); setSelectedCategory(null); }}
        >
          Para Você
        </Tab>
        <Tab
          $active={feedType === 'following' && !selectedCategory}
          onClick={() => { setFeedType('following'); setSelectedCategory(null); }}
        >
          Seguindo
        </Tab>
        <Tab
          $active={feedType === 'explore' && !selectedCategory}
          onClick={() => { setFeedType('explore'); setSelectedCategory(null); }}
        >
          Explorar
        </Tab>
      </FeedTabs>

      <CategoryFilter>
        <CategoryButton
          $active={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
        >
          Todas
        </CategoryButton>
        <CategoryButton
          $active={selectedCategory === PostCategoryEnum.CONQUISTAS}
          onClick={() => setSelectedCategory(PostCategoryEnum.CONQUISTAS)}
        >
          🏆 Conquistas
        </CategoryButton>
        <CategoryButton
          $active={selectedCategory === PostCategoryEnum.DICAS}
          onClick={() => setSelectedCategory(PostCategoryEnum.DICAS)}
        >
          💡 Dicas
        </CategoryButton>
        <CategoryButton
          $active={selectedCategory === PostCategoryEnum.HISTORIAS}
          onClick={() => setSelectedCategory(PostCategoryEnum.HISTORIAS)}
        >
          📖 Histórias
        </CategoryButton>
        <CategoryButton
          $active={selectedCategory === PostCategoryEnum.PERGUNTAS}
          onClick={() => setSelectedCategory(PostCategoryEnum.PERGUNTAS)}
        >
          ❓ Perguntas
        </CategoryButton>
        <CategoryButton
          $active={selectedCategory === PostCategoryEnum.METAS}
          onClick={() => setSelectedCategory(PostCategoryEnum.METAS)}
        >
          🎯 Metas
        </CategoryButton>
      </CategoryFilter>

      <Content>
        <FeedColumn>
          {isLoading ? (
            <LoadingState>Carregando...</LoadingState>
          ) : posts.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyTitle>Nenhum post encontrado</EmptyTitle>
              <EmptyText>Seja o primeiro a compartilhar algo!</EmptyText>
            </EmptyState>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onCommentClick={handleCommentClick}
                onPostUpdate={handlePostUpdate}
              />
            ))
          )}
        </FeedColumn>

        <SidebarColumn>
          <SidebarCard>
            <SidebarTitle>💡 Dica da Comunidade</SidebarTitle>
            <SidebarText>
              Compartilhe suas conquistas e aprenda com outros usuários!
            </SidebarText>
          </SidebarCard>

          <SidebarCard>
            <SidebarTitle>📊 Estatísticas</SidebarTitle>
            <StatItem>
              <StatLabel>Posts Hoje</StatLabel>
              <StatValue>{posts.length}</StatValue>
            </StatItem>
          </SidebarCard>
        </SidebarColumn>
      </Content>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostUpdate}
        />
      )}

      {selectedPostForComments !== null && (
        <CommentsModal
          postId={selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
        />
      )}
    </Container>
  );
};

// CreatePostModal Component
interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>(PostCategoryEnum.GERAL);
  const [type, setType] = useState<PostType>(PostTypeEnum.TEXT);
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      addToast('Digite o conteúdo do post', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const postData: PostCreateDTO = {
        type,
        category,
        content: content.trim(),
        hashtags: hashtags.trim() || undefined
      };

      await createPost(postData);
      addToast('Post criado com sucesso!', 'success');
      onPostCreated();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      addToast('Erro ao criar post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Criar Novo Post</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Categoria</Label>
            <Select value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
              <option value={PostCategoryEnum.GERAL}>Geral</option>
              <option value={PostCategoryEnum.CONQUISTAS}>Conquistas</option>
              <option value={PostCategoryEnum.DICAS}>Dicas</option>
              <option value={PostCategoryEnum.HISTORIAS}>Histórias</option>
              <option value={PostCategoryEnum.PERGUNTAS}>Perguntas</option>
              <option value={PostCategoryEnum.METAS}>Metas</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Conteúdo</Label>
            <TextArea
              placeholder="Compartilhe suas ideias..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </FormGroup>

          <FormGroup>
            <Label>Hashtags (separadas por vírgula)</Label>
            <Input
              placeholder="fintech, investimentos, economia"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// CommentsModal Component
interface CommentsModalProps {
  postId: number;
  onClose: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ postId, onClose }) => {
  const { addToast } = useToast();
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await getCommentsByPostId(postId);
      setComments(response.content);
    } catch (error) {
      console.error('Error loading comments:', error);
      addToast('Erro ao carregar comentários', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <CommentsModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>💬 Comentários ({comments.length})</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <CommentsModalBody>
          {isLoading ? (
            <LoadingState>Carregando comentários...</LoadingState>
          ) : (
            <CommentList comments={comments} postId={postId} onCommentsUpdate={loadComments} />
          )}
        </CommentsModalBody>
      </CommentsModalContent>
    </ModalOverlay>
  );
};

export default CommunityPage;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const FeedTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.textLight};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textMedium)};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.backgroundAlt)};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.textDark)};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textLight)};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.primary + '20')};
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FeedColumn = styled.div``;

const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 968px) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 12px;
  padding: 20px;
`;

const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 12px 0;
`;

const SidebarText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textLight};
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textMedium};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.textLight};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.textLight};
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMedium};
  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.textLight};
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CommentsModalContent = styled(ModalContent)`
  max-width: 700px;
  max-height: 85vh;
`;

const CommentsModalBody = styled(ModalBody)`
  padding: 0;
  max-height: calc(85vh - 70px);
  overflow-y: auto;
`;

const EmptyCommentsState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;
