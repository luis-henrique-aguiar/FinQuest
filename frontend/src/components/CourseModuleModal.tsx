import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import {
  createCourse,
  updateCourse,
  checkCourseIdAvailability,
  type CourseCreateDTO,
  type CourseUpdateDTO,
} from '../services/contentService';
import * as S from './CourseModuleModal.styles';

interface CourseModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCourse?: {
    id: string;
    title: string;
    description: string;
    icon?: string;
    recFinPoints?: number;
  } | null;
}

const CourseModuleModal: React.FC<CourseModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingCourse,
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingId, setCheckingId] = useState(false);
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    recFinPoints: 100,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or editingCourse changes
  useEffect(() => {
    if (isOpen) {
      if (editingCourse) {
        setFormData({
          id: editingCourse.id,
          title: editingCourse.title,
          description: editingCourse.description,
          icon: editingCourse.icon || '',
          recFinPoints: editingCourse.recFinPoints || 100,
        });
        setIdAvailable(true);
      } else {
        setFormData({
          id: '',
          title: '',
          description: '',
          icon: '',
          recFinPoints: 100,
        });
        setIdAvailable(null);
      }
      setErrors({});
    }
  }, [isOpen, editingCourse]);

  // Check ID availability with debounce
  useEffect(() => {
    if (!editingCourse && formData.id) {
      const idPattern = /^M\d+$/;
      
      if (!idPattern.test(formData.id)) {
        setIdAvailable(false);
        setErrors(prev => ({ ...prev, id: 'O ID deve seguir o formato M seguido de números (ex: M10)' }));
        return;
      }

      setCheckingId(true);
      const timer = setTimeout(async () => {
        try {
          const available = await checkCourseIdAvailability(formData.id);
          setIdAvailable(available);
          
          if (!available) {
            setErrors(prev => ({ ...prev, id: 'Este ID já está em uso' }));
          } else {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.id;
              return newErrors;
            });
          }
        } catch (error) {
          console.error('Erro ao verificar disponibilidade:', error);
        } finally {
          setCheckingId(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData.id, editingCourse]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editingCourse && !formData.id) {
      newErrors.id = 'O ID é obrigatório';
    }

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'O título deve ter no mínimo 3 caracteres';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'A descrição deve ter no mínimo 10 caracteres';
    }

    if (!formData.icon) {
      newErrors.icon = 'O ícone é obrigatório';
    }

    if (formData.recFinPoints < 0 || formData.recFinPoints > 10000) {
      newErrors.recFinPoints = 'Os pontos devem estar entre 0 e 10000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Corrija os erros no formulário', 'error');
      return;
    }

    if (!editingCourse && !idAvailable) {
      addToast('O ID informado não está disponível', 'error');
      return;
    }

    setLoading(true);

    try {
      if (editingCourse) {
        const updateDto: CourseUpdateDTO = {
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          recFinPoints: formData.recFinPoints,
        };
        await updateCourse(editingCourse.id, updateDto);
        addToast('Módulo atualizado com sucesso!', 'success');
      } else {
        const createDto: CourseCreateDTO = {
          id: formData.id,
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          recFinPoints: formData.recFinPoints,
        };
        await createCourse(createDto);
        addToast('Módulo criado com sucesso!', 'success');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Erro ao salvar módulo';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>{editingCourse ? 'Editar Módulo' : 'Novo Módulo'}</S.Title>
          <S.CloseButton onClick={onClose}>
            <X size={20} />
          </S.CloseButton>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          {!editingCourse && (
            <S.FormGroup>
              <S.Label htmlFor="id">
                ID do Módulo <S.Required>*</S.Required>
              </S.Label>
              <S.Input
                id="id"
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                placeholder="M10"
                $hasError={!!errors.id}
                disabled={loading}
              />
              {checkingId && <S.HelpText>Verificando disponibilidade...</S.HelpText>}
              {!checkingId && idAvailable === true && <S.SuccessText><Check size={14} /> ID disponível</S.SuccessText>}
              {errors.id && <S.ErrorText><AlertCircle size={14} /> {errors.id}</S.ErrorText>}
              <S.HelpText>Formato: M seguido de números (ex: M10, M20)</S.HelpText>
            </S.FormGroup>
          )}

          <S.FormGroup>
            <S.Label htmlFor="title">
              Título <S.Required>*</S.Required>
            </S.Label>
            <S.Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Introdução às Finanças"
              $hasError={!!errors.title}
              disabled={loading}
              maxLength={100}
            />
            <S.CharCount>{formData.title.length}/100</S.CharCount>
            {errors.title && <S.ErrorText><AlertCircle size={14} /> {errors.title}</S.ErrorText>}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="description">
              Descrição <S.Required>*</S.Required>
            </S.Label>
            <S.Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o conteúdo e objetivos deste módulo..."
              $hasError={!!errors.description}
              disabled={loading}
              maxLength={500}
              rows={4}
            />
            <S.CharCount>{formData.description.length}/500</S.CharCount>
            {errors.description && <S.ErrorText><AlertCircle size={14} /> {errors.description}</S.ErrorText>}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="icon">
              Ícone (Emoji) <S.Required>*</S.Required>
            </S.Label>
            <S.IconInputGroup>
              <S.Input
                id="icon"
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🎓"
                $hasError={!!errors.icon}
                disabled={loading}
                maxLength={10}
              />
              {formData.icon && <S.IconPreview>{formData.icon}</S.IconPreview>}
            </S.IconInputGroup>
            {errors.icon && <S.ErrorText><AlertCircle size={14} /> {errors.icon}</S.ErrorText>}
            <S.HelpText>Cole um emoji ou use o seletor de emojis do seu sistema</S.HelpText>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="recFinPoints">
              Pontos Recomendados <S.Required>*</S.Required>
            </S.Label>
            <S.Input
              id="recFinPoints"
              type="number"
              value={formData.recFinPoints}
              onChange={(e) => setFormData({ ...formData, recFinPoints: parseInt(e.target.value) || 0 })}
              min={0}
              max={10000}
              $hasError={!!errors.recFinPoints}
              disabled={loading}
            />
            {errors.recFinPoints && <S.ErrorText><AlertCircle size={14} /> {errors.recFinPoints}</S.ErrorText>}
            <S.HelpText>Pontos totais estimados para completar este módulo (0-10000)</S.HelpText>
          </S.FormGroup>

          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </S.CancelButton>
            <S.SubmitButton 
              type="submit" 
              disabled={loading || (!editingCourse && (!idAvailable || checkingId))}
            >
              {loading ? 'Salvando...' : editingCourse ? 'Atualizar Módulo' : 'Criar Módulo'}
            </S.SubmitButton>
          </S.ButtonGroup>
        </S.Form>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default CourseModuleModal;
