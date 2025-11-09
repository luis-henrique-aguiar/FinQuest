import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.background};
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: scale(1.1);
  }
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

export const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} 0;

  .meta-item {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMedium};

    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xxl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`;

export const StyledMarkdown = styled.div`
  h1 {
    font-size: 2.5rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  h2 {
    font-size: 1.8rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.xxl} 0
      ${({ theme }) => theme.spacing.lg} 0;
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    border-bottom: 3px solid ${({ theme }) => theme.colors.accent};

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  h3 {
    font-size: 1.4rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.xl} 0
      ${({ theme }) => theme.spacing.md} 0;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  h4 {
    font-size: 1.2rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.primary};
    margin: ${({ theme }) => theme.spacing.lg} 0
      ${({ theme }) => theme.spacing.sm} 0;
  }

  p {
    font-size: 1.05rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.md} 0;
  }

  blockquote {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}11 0%,
      ${({ theme }) => theme.colors.secondary}11 100%
    );
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.xl} 0;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-style: italic;

    p {
      margin: 0;
      color: ${({ theme }) => theme.colors.textDark};
    }
  }

  ul,
  ol {
    margin: ${({ theme }) => theme.spacing.lg} 0;
    padding-left: ${({ theme }) => theme.spacing.xl};
  }

  li {
    font-size: 1.05rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.sm} 0;

    &::marker {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
  }

  code {
    background: ${({ theme }) => theme.colors.background};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    font-size: 0.9em;
    color: ${({ theme }) => theme.colors.error};
  }

  pre {
    background: ${({ theme }) => theme.colors.textDark};
    color: ${({ theme }) => theme.colors.white};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    overflow-x: auto;
    margin: ${({ theme }) => theme.spacing.xl} 0;

    code {
      background: none;
      color: inherit;
      padding: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.xl} 0;
    overflow-x: auto;
    display: block;

    @media (min-width: 769px) {
      display: table;
    }
  }

  thead {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  th {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  td {
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.background};

    &:first-child {
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
  }

  tbody tr {
    &:nth-child(even) {
      background: ${({ theme }) => theme.colors.background};
    }

    &:hover {
      background: ${({ theme }) => theme.colors.primary}11;
    }
  }

  hr {
    border: none;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary}00 0%,
      ${({ theme }) => theme.colors.primary} 50%,
      ${({ theme }) => theme.colors.primary}00 100%
    );
    margin: ${({ theme }) => theme.spacing.xxl} 0;
  }
`;

export const HighlightBox = styled.div`
  background: ${({ theme }) => theme.colors.accent}22;
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  p:first-child {
    margin-top: 0;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

export const FooterNavigation = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMedium};

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.colors.background};
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Questionário Components

export const QuizContainer = styled.div`
  max-width: 1200px;
  margin: ${({ theme }) => theme.spacing.xxl} auto 0;
  padding: 0 ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const QuizCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xxl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-top: 4px solid ${({ theme }) => theme.colors.accent};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`;

export const QuizHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h3 {
    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 1rem;
  }
`;

export const QuizQuestion = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  .question-text {
    font-size: 1.1rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    line-height: 1.6;
  }
`;

export const QuizOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const QuizOption = styled.label<{
  $selected: boolean;
  $correct?: boolean;
  $incorrect?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid
    ${({ $selected, $correct, $incorrect, theme }) => {
      if ($correct) return theme.colors.secondary;
      if ($incorrect) return theme.colors.error;
      if ($selected) return theme.colors.primary;
      return theme.colors.background;
    }};
  background: ${({ $selected, $correct, $incorrect, theme }) => {
    if ($correct) return `${theme.colors.secondary}11`;
    if ($incorrect) return `${theme.colors.error}11`;
    if ($selected) return `${theme.colors.primary}11`;
    return theme.colors.background;
  }};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    ${({ $disabled, theme }) =>
      !$disabled &&
      `
   border-color: ${theme.colors.primary};
   transform: translateX(4px);
  `}
  }

  input[type="radio"] {
    display: none; /* Esconde o radio button padrão */
  }

  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ $selected, $correct, $incorrect, theme }) => {
      if ($correct) return theme.colors.secondary;
      if ($incorrect) return theme.colors.error;
      if ($selected) return theme.colors.primary;
      return theme.colors.white;
    }};
    color: ${({ $selected, $correct, $incorrect, theme }) => {
      if ($correct || $incorrect || $selected) return theme.colors.white;
      return theme.colors.textDark;
    }};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-size: 0.9rem;
    border: 2px solid
      ${({ $selected, $correct, $incorrect, theme }) => {
        if ($correct) return theme.colors.secondary;
        if ($incorrect) return theme.colors.error;
        if ($selected) return theme.colors.primary;
        return theme.colors.textMedium + "44";
      }};
    flex-shrink: 0;
  }

  .option-text {
    flex: 1;
    font-size: 1rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textDark};
  }

  .option-icon {
    margin-left: auto;
    flex-shrink: 0;
  }
`;

export const QuizSubmitButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;

export const QuizFeedback = styled.div<{ $correct: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border-left: 4px solid
    ${({ $correct, theme }) =>
      $correct ? theme.colors.secondary : theme.colors.error};
  background: ${({ $correct, theme }) =>
    $correct ? `${theme.colors.secondary}11` : `${theme.colors.error}11`};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};

  .feedback-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .feedback-content {
    flex: 1;

    h4 {
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
      font-size: 1.1rem;
      color: ${({ $correct, theme }) =>
        $correct ? theme.colors.secondary : theme.colors.error};
    }

    p {
      margin: 0;
      line-height: 1.6;
      color: ${({ theme }) => theme.colors.textDark};
    }
  }
`;
