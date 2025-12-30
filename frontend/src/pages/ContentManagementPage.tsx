import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiCheckCircle } from 'react-icons/fi';
import { contentService } from '../services/contentService';
import type { LessonSummaryDTO } from '../services/contentService';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import FullScreenLoader from '../components/common/FullScreenLoader';
import * as S from './ContentManagementPage.styles';

const ContentManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<LessonSummaryDTO | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await contentService.getAllLessons();
      setLessons(data);
    } catch (error) {
      addToast('Erro ao carregar lições', 'error');
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/content/new');
  };

  const handleEdit = (lesson: LessonSummaryDTO) => {
    navigate(`/admin/content/edit/${lesson.id}`);
  };

  const handleDelete = async (lessonId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta lição?')) {
      return;
    }

    try {
      await contentService.deleteLesson(lessonId);
      addToast('Lição excluída com sucesso', 'success');
      loadLessons();
    } catch (error) {
      addToast('Erro ao excluir lição', 'error');
      console.error('Error deleting lesson:', error);
    }
  };


  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Gerenciamento de Conteúdo</S.Title>
        <S.ActionButtons>
          <Button onClick={handleCreateNew} variant="primary">
            <FiPlus /> Nova Lição
          </Button>
        </S.ActionButtons>
      </S.Header>

      <S.ContentGrid>
        <S.LessonsList>
          <S.ListHeader>
            <S.ListTitle>Lições Cadastradas</S.ListTitle>
          </S.ListHeader>

          {lessons.length === 0 ? (
            <S.EmptyState>
              <S.EmptyStateIcon>📚</S.EmptyStateIcon>
              <S.EmptyStateText>
                Nenhuma lição cadastrada. Clique em "Nova Lição" para começar.
              </S.EmptyStateText>
            </S.EmptyState>
          ) : (
            lessons.map((lesson) => (
              <S.LessonItem
                key={lesson.id}
                isSelected={selectedLesson?.id === lesson.id}
                onClick={() => setSelectedLesson(lesson)}
              >
                <S.LessonItemHeader>
                  <S.LessonItemTitle>{lesson.title}</S.LessonItemTitle>
                  <S.LessonItemActions>
                    <S.IconButton
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleEdit(lesson);
                      }}
                      title="Editar"
                    >
                      <FiEdit2 />
                    </S.IconButton>
                    <S.IconButton
                      className="delete"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDelete(lesson.id);
                      }}
                      title="Excluir"
                    >
                      <FiTrash2 />
                    </S.IconButton>
                  </S.LessonItemActions>
                </S.LessonItemHeader>
                <S.LessonItemInfo>
                  <S.InfoBadge>
                    <FiBook size={14} />
                    {lesson.courseName}
                  </S.InfoBadge>
                  <S.InfoBadge>
                    Ordem: {lesson.lessonOrder}
                  </S.InfoBadge>
                  {!lesson.isDraft && (
                    <S.InfoBadge style={{ color: '#28A745' }}>
                      <FiCheckCircle size={14} />
                      Publicado
                    </S.InfoBadge>
                  )}
                </S.LessonItemInfo>
              </S.LessonItem>
            ))
          )}
        </S.LessonsList>
      </S.ContentGrid>

    </S.Container>
  );
};

export default ContentManagementPage;
