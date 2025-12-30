import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiEye, FiEdit, FiColumns, FiHelpCircle } from 'react-icons/fi';
import { contentService } from '../services/contentService';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import MarkdownStyleGuide from '../components/editor/MarkdownStyleGuide';
import FullScreenLoader from '../components/common/FullScreenLoader';
import * as S from './LessonEditorPage.styles';

const LessonEditorPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId?: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showStyleGuide, setShowStyleGuide] = useState(false);
  const [activeView, setActiveView] = useState<'edit' | 'preview' | 'split'>('split');
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    lessonOrder: 1,
    content: '',
    recFinPoints: 100,
    isDraft: true,
  });

  useEffect(() => {
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  const loadLesson = async () => {
    if (!lessonId) return;

    try {
      setLoading(true);
      const content = await contentService.getLessonContent(lessonId);
      const lessons = await contentService.getAllLessons();
      const lesson = lessons.find((l) => l.id === lessonId);

      if (lesson) {
        setFormData({
          title: lesson.title,
          courseId: lesson.courseId,
          lessonOrder: lesson.lessonOrder,
          content: content,
          recFinPoints: 100,
          isDraft: lesson.isDraft,
        });
      }
    } catch (error) {
      addToast('Erro ao carregar lição', 'error');
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title.trim()) {
      addToast('O título é obrigatório', 'error');
      return;
    }

    if (!formData.content.trim()) {
      addToast('O conteúdo é obrigatório', 'error');
      return;
    }

    if (!formData.courseId.trim()) {
      addToast('O ID do curso é obrigatório', 'error');
      return;
    }

    try {
      setSaving(true);
      const dataToSave = {
        ...formData,
        isDraft: !publish,
      };

      if (lessonId) {
        await contentService.updateLesson(lessonId, {
          title: dataToSave.title,
          content: dataToSave.content,
          recFinPoints: dataToSave.recFinPoints,
          isDraft: dataToSave.isDraft,
        });
        addToast(
          publish ? 'Lição publicada com sucesso!' : 'Lição salva como rascunho',
          'success'
        );
      } else {
        await contentService.createLesson(dataToSave);
        addToast(
          publish ? 'Lição criada e publicada!' : 'Lição criada como rascunho',
          'success'
        );
      }

      navigate('/admin/content');
    } catch (error) {
      addToast('Erro ao salvar lição', 'error');
      console.error('Error saving lesson:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        'Tem certeza que deseja sair? Alterações não salvas serão perdidas.'
      )
    ) {
      navigate('/admin/content');
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <S.Container>
      <S.Header>
        <S.HeaderLeft>
          <S.Title>{lessonId ? 'Editar Lição' : 'Nova Lição'}</S.Title>
          <S.DraftBadge isDraft={formData.isDraft}>
            {formData.isDraft ? '📝 Rascunho' : '✅ Publicado'}
          </S.DraftBadge>
        </S.HeaderLeft>

        <S.HeaderRight>
          <S.ViewToggle>
            <S.ViewButton
              active={activeView === 'edit'}
              onClick={() => setActiveView('edit')}
              title="Modo Edição"
            >
              <FiEdit size={18} />
              <span>Editar</span>
            </S.ViewButton>
            <S.ViewButton
              active={activeView === 'split'}
              onClick={() => setActiveView('split')}
              title="Modo Dividido"
            >
              <FiColumns size={18} />
              <span>Dividido</span>
            </S.ViewButton>
            <S.ViewButton
              active={activeView === 'preview'}
              onClick={() => setActiveView('preview')}
              title="Modo Visualização"
            >
              <FiEye size={18} />
              <span>Visualizar</span>
            </S.ViewButton>
          </S.ViewToggle>

          <S.ActionButtons>
            <Button onClick={handleCancel} variant="secondary" disabled={saving}>
              <FiX /> Cancelar
            </Button>
            <Button
              onClick={() => handleSave(false)}
              variant="secondary"
              disabled={saving}
            >
              <FiSave /> Salvar Rascunho
            </Button>
            <Button
              onClick={() => handleSave(true)}
              variant="primary"
              disabled={saving}
            >
              <FiSave /> {lessonId ? 'Atualizar e Publicar' : 'Publicar'}
            </Button>
          </S.ActionButtons>
        </S.HeaderRight>
      </S.Header>

      <S.MetadataSection>
        <S.MetadataGrid>
          <S.FormGroup>
            <S.Label>
              Título da Lição <S.Required>*</S.Required>
            </S.Label>
            <S.Input
              type="text"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Introdução à Educação Financeira"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>
              ID do Módulo <S.Required>*</S.Required>
            </S.Label>
            <S.Input
              type="text"
              value={formData.courseId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, courseId: e.target.value }))
              }
              placeholder="Ex: 0, 1, 2..."
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>
              Ordem da Lição <S.Required>*</S.Required>
            </S.Label>
            <S.Input
              type="number"
              value={formData.lessonOrder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  lessonOrder: parseInt(e.target.value) || 1,
                }))
              }
              min="1"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>FinPoints da Lição</S.Label>
            <S.Input
              type="number"
              value={formData.recFinPoints}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  recFinPoints: parseInt(e.target.value) || 100,
                }))
              }
              min="0"
            />
          </S.FormGroup>
        </S.MetadataGrid>
      </S.MetadataSection>

      <S.EditorSection>
        <S.EditorHeader>
          <S.EditorTitle>Conteúdo da Lição (Markdown)</S.EditorTitle>
          <S.HelpTextContainer>
            <S.HelpText>
              💡 Use Markdown para formatar o texto. A visualização ao lado mostra
              como ficará para os alunos.
            </S.HelpText>
            <S.HelpButton onClick={() => setShowStyleGuide(true)}>
              <FiHelpCircle size={18} />
              Ver Guia de Estilos
            </S.HelpButton>
          </S.HelpTextContainer>
        </S.EditorHeader>

        <MarkdownEditor
          initialValue={formData.content}
          onChange={(content) =>
            setFormData((prev) => ({ ...prev, content }))
          }
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </S.EditorSection>

      <MarkdownStyleGuide
        isOpen={showStyleGuide}
        onClose={() => setShowStyleGuide(false)}
      />
    </S.Container>
  );
};

export default LessonEditorPage;
