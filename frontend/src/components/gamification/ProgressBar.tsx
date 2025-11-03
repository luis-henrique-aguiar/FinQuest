import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  variant?: "default" | "streak" | "xp";
  height?: number;
  tooltipText?: string;
  className?: string;
}

const Tooltip = styled.div`
  visibility: hidden;
  width: max-content;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }
`;

const ProgressBarContainer = styled.div<{ height: number }>`
  position: relative;
  width: 100%;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.pill};

  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const ProgressFill = styled(motion.div)<{
  variant: "default" | "streak" | "xp";
}>`
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.pill};

  ${({ variant, theme }) => {
    switch (variant) {
      case "streak":
        return `background: linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.warning});`;
      case "xp":
        return `background: linear-gradient(90deg, ${theme.colors.secondary}, ${theme.colors.primary});`;
      default:
        return `background-color: ${theme.colors.secondary};`;
    }
  }}
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = "default",
  height = 8,
  tooltipText,
  className,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <ProgressBarContainer height={height} className={className}>
      <ProgressFill
        variant={variant}
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {/* Renderiza o tooltip apenas se o texto for fornecido */}
      {tooltipText && <Tooltip>{tooltipText}</Tooltip>}
    </ProgressBarContainer>
  );
};

export default ProgressBar;
