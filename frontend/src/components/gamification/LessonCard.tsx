import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Book } from "react-feather";
import { useToast } from "../../hooks/useToast";
import { enrollInCourse, type CourseProgressDTO } from "../../services/courseService";

interface LessonCardProps {
  course: CourseProgressDTO;
  onClick: () => void;
}

const CardContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.colors.border};
  
  /* Layout Flexível para alinhar o rodapé */
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.03);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(1.01);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}22 0%,
    ${({ theme }) => theme.colors.primary}33 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  /* Limita a 2 linhas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
  /* Limita a 3 linhas */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const ProgressSection = styled.div`
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressFill = styled(motion.div)<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  width: ${({ $progress }) => $progress}%;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const StatusBadge = styled.div<{ $completed: boolean }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ $completed, theme }) =>
    $completed
      ? `
        background: ${theme.colors.success}22;
        color: ${theme.colors.success};
      `
      : `
        background: ${theme.colors.primary}22;
        color: ${theme.colors.primary};
      `}
`;

const NotStartedBadge = styled.div`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.textMedium};
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
`;

const ActionButton = styled.button<{ $variant: "primary" | "outline" }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.button};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $variant, theme }) => {
    if ($variant === "primary") {
      return `
        background-color: ${theme.colors.primary};
        color: white;
        border-color: ${theme.colors.primary};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}dd;
          transform: translateY(-1px);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background-color: transparent;
        color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}10;
          transform: translateY(-1px);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LessonCard: React.FC<LessonCardProps> = ({ course, onClick }) => {
  const { addToast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!course) return null;

  const progress = typeof course.progress === "number" ? course.progress : 0;
  const isCompleted = progress === 100;
  const isNotStarted = progress === 0;
  
  const isEnrolled = course.progress !== null && course.progress !== undefined;

  const getButtonText = () => {
    if (!isEnrolled) return "Iniciar Curso";
    if (isCompleted) return "Revisar Curso";
    return "Continuar";
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isEnrolled) {
      onClick();
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInCourse(course.id);
      addToast(`Matrícula realizada em ${course.title}!`, "success");
      onClick();
    } catch (error) {
      addToast("Erro ao realizar matrícula.", "error");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <CardContainer
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Header>
        <IconContainer>{course.icon || "📚"}</IconContainer>
        <Content>
          <Title>{course.title || "Curso sem título"}</Title>
          <Description>
            {course.description || "Sem descrição disponível para este curso."}
          </Description>
        </Content>
      </Header>

      <CardFooter>
        {/* Barra de Progresso e Status (Somente se matriculado) */}
        {isEnrolled && (
          <ProgressSection>
            {isNotStarted ? (
              <NotStartedBadge>
                <Book size={14} />
                <span>Não Iniciado</span>
              </NotStartedBadge>
            ) : (
              <>
                <ProgressBar>
                  <ProgressFill
                    $progress={progress}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </ProgressBar>
                <ProgressText>
                  <span>{progress}% concluído</span>
                  <StatusBadge $completed={isCompleted}>
                    {isCompleted ? "Concluído" : "Em Progresso"}
                  </StatusBadge>
                </ProgressText>
              </>
            )}
          </ProgressSection>
        )}

        {/* Botão de Ação Principal */}
        <ActionButton
          $variant={isEnrolled ? "outline" : "primary"}
          onClick={handleButtonClick}
          disabled={isEnrolling}
        >
          {isEnrolling ? "Carregando..." : getButtonText()}
        </ActionButton>
      </CardFooter>
    </CardContainer>
  );
};