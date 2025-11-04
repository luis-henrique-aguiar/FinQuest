import React from 'react';
import ProgressBar from '../gamification/ProgressBar';
import {
  DailyGoalCard,
  GoalHeader,
  GoalTitle,
  GoalProgress
} from '../../pages/HomePage.styles';

interface DailyGoalItemProps {
  title: string;
  progress: number;
  total: number;
}

export const DailyGoalItem: React.FC<DailyGoalItemProps> = ({ title, progress, total }) => {
  const progressPercent = (progress / total) * 100;

  return (
    <DailyGoalCard>
      <GoalHeader>
        <GoalTitle>{title}</GoalTitle>
        <GoalProgress>
          {progress}/{total}
        </GoalProgress>
      </GoalHeader>
      <ProgressBar
        progress={progressPercent}
        variant="streak"
        height={8}
      />
    </DailyGoalCard>
  );
};