import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { useToast } from "../../hooks/useToast";
import { enrollInCourse } from "../../services/courseService";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number | null;
}

const CardContainer = styled.div<{
  $isEnrolled: boolean;
  $isClickable: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform ${({ theme }) => theme.animations.fast} ease,
    box-shadow ${({ theme }) => theme.animations.fast} ease;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  border: 2px solid transparent;

  ${({ $isEnrolled, theme }) =>
    $isEnrolled &&
    `
    border-color: ${theme.colors.primary}20;
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme, $isEnrolled }) =>
      $isEnrolled ? theme.colors.primary : "transparent"};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Icon = styled.div`
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.3;
`;

const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
`;

const ProgressPercentage = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CompletedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
  background-color: ${({ theme }) => theme.colors.secondary}20;
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.6;
  flex-grow: 1;
`;

const ProgressSection = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
`;

const ActionButton = styled.button<{ $variant: "primary" | "outline" }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.button};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  border: 2px solid;

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

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  icon,
  progress,
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = progress !== null;
  const isCompleted = progress === 100;

  const handleCardClick = () => {
    if (isEnrolled) {
      navigate(`/learn/${id}`);
    }
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isEnrolled) {
      navigate(`/learn/${id}`);
      return;
    }

    setIsEnrolling(true);

    try {
      await enrollInCourse(id);
      addToast(`Matrícula em "${title}" realizada!`, "success");
      navigate(`/learn/${id}`);
    } catch (error) {
      console.error("Erro ao se matricular:", error);
      addToast(
        "Ops! Não foi possível realizar a matrícula. Tente novamente.",
        "error"
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const getButtonText = () => {
    if (isCompleted) return "Revisar Curso";
    if (isEnrolled) return "Continuar Curso";
    return "Iniciar Curso";
  };

  return (
    <CardContainer
      $isEnrolled={isEnrolled}
      $isClickable={isEnrolled}
      onClick={handleCardClick}
    >
      <CardHeader>
        <Icon>{icon}</Icon>
        <HeaderContent>
          <Title>{title}</Title>
          {isEnrolled && (
            <ProgressInfo>
              {isCompleted ? (
                <CompletedBadge>✓ Concluído</CompletedBadge>
              ) : (
                <>
                  <span>Progresso:</span>
                  <ProgressPercentage>{progress}%</ProgressPercentage>
                </>
              )}
            </ProgressInfo>
          )}
        </HeaderContent>
      </CardHeader>

      <Description>{description}</Description>

      <ProgressSection $visible={isEnrolled}>
        <ProgressBar
          progress={progress || 0}
          variant="xp"
          height={10}
          tooltipText={`${progress}% concluído`}
        />
      </ProgressSection>

      <ActionButton
        $variant={isEnrolled ? "outline" : "primary"}
        onClick={handleButtonClick}
        disabled={isEnrolling}
      >
        {isEnrolling ? "Carregando..." : getButtonText()}
      </ActionButton>
    </CardContainer>
  );
};
