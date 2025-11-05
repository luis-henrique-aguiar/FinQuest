import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, PlayCircle } from 'react-feather';
import Card from '../common/Card';

interface LessonCardProps {
  courseId: string;
  lessonId: string;
  title: string;
  isCompleted: boolean;
}

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100%;
`;

const Icon = styled.div<{ $isCompleted: boolean }>`
  font-size: 2.5rem;
  color: ${({ theme, $isCompleted }) =>
    $isCompleted ? theme.colors.secondary : theme.colors.primary};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textDark};
  flex-grow: 1;
`;

const StatusText = styled.span<{ $isCompleted: boolean }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme, $isCompleted }) =>
    $isCompleted ? theme.colors.secondary : theme.colors.textMedium};
`;

export const LessonCard: React.FC<LessonCardProps> = ({
  courseId,
  lessonId,
  title,
  isCompleted,
}) => {
  const navigate = useNavigate();

  const handleLessonClick = () => {
    navigate(`/learn/${courseId}/${lessonId}`);
  };

  return (
    <Card
      variant="elevated"
      padding="large"
      onClick={handleLessonClick}
      interactive
    >
      <CardContent>
        <Icon $isCompleted={isCompleted}>
          {isCompleted ? <CheckCircle size={40} /> : <PlayCircle size={40} />}
        </Icon>
        <Title>{title}</Title>
        <StatusText $isCompleted={isCompleted}>
          {isCompleted ? "Concluído" : "Iniciar Lição"}
        </StatusText>
      </CardContent>
    </Card>
  );
};