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
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`;

export const StyledMarkdown = styled.div`
  h1 {
    font-size: 2.25rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
    line-height: 1.2;
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  h2 {
    font-size: 1.75rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.xxl} 0 ${({ theme }) => theme.spacing.lg} 0;
    padding-left: ${({ theme }) => theme.spacing.md};
    border-left: 5px solid ${({ theme }) => theme.colors.secondary};
    line-height: 1.3;
    letter-spacing: -0.3px;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  h3 {
    font-size: 1.4rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md} 0;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  h4 {
    font-size: 1.15rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.primary};
    margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm} 0;
  }

  p {
    font-size: 1.05rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.md} 0;
    text-align: justify;
    hyphens: auto;

    @media (max-width: 768px) {
      font-size: 1rem;
      text-align: left;
    }
  }

  ul {
    list-style: none;
    margin: ${({ theme }) => theme.spacing.lg} 0;
    padding-left: 0;
    
    li {
      position: relative;
      padding-left: ${({ theme }) => theme.spacing.xl};
      margin: ${({ theme }) => theme.spacing.md} 0;
      line-height: 1.8;
      color: ${({ theme }) => theme.colors.textDark};

      &::before {
        content: '▸';
        position: absolute;
        left: ${({ theme }) => theme.spacing.sm};
        color: ${({ theme }) => theme.colors.secondary};
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
        font-size: 1.3rem;
      }
    }
  }

  ol {
    counter-reset: item;
    margin: ${({ theme }) => theme.spacing.lg} 0;
    padding-left: 0;
    
    li {
      position: relative;
      padding-left: ${({ theme }) => theme.spacing.xl};
      margin: ${({ theme }) => theme.spacing.md} 0;
      line-height: 1.8;
      color: ${({ theme }) => theme.colors.textDark};
      list-style: none;

      &::before {
        content: counter(item) ".";
        counter-increment: item;
        position: absolute;
        left: ${({ theme }) => theme.spacing.sm};
        color: ${({ theme }) => theme.colors.primary};
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
        font-size: 1.1rem;
        min-width: 24px;
      }
    }
  }

  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
  }

  em {
    font-style: italic;
    color: ${({ theme }) => theme.colors.textDark};
  }

  pre {
    background: #1E2738;
    color: #E2E8F0;
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    overflow-x: auto;
    margin: ${({ theme }) => theme.spacing.xl} 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);

    code {
      background: none;
      color: inherit;
      padding: 0;
      border: none;
      font-size: 0.92rem;
      line-height: 1.6;
      font-family: 'Fira Code', 'Courier New', monospace;
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: ${({ theme }) => theme.spacing.xl} 0;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  thead {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primary}dd 100%);
    color: white;
  }

  th {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    text-align: left;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 0.95rem;

    &:first-child {
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
  }

  tbody tr {
    background: ${({ theme }) => theme.colors.white};
    transition: all 0.2s ease;

    &:nth-child(even) {
      background: ${({ theme }) => theme.colors.backgroundAlt};
    }

    &:hover {
      background: ${({ theme }) => theme.colors.primary}08;
      transform: scale(1.01);
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary}40;
    transition: all 0.2s ease;
    padding-bottom: 1px;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
      border-bottom-color: ${({ theme }) => theme.colors.secondary};
      background: ${({ theme }) => theme.colors.secondary}08;
      padding: 2px 4px;
      margin: -2px -4px;
      border-radius: 3px;
    }
  }

  hr {
    border: none;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.primary} 20%,
      ${({ theme }) => theme.colors.secondary} 50%,
      ${({ theme }) => theme.colors.primary} 80%,
      transparent 100%
    );
    margin: ${({ theme }) => theme.spacing.xxl} 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    margin: ${({ theme }) => theme.spacing.xl} auto;
    display: block;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

/* Box de Destaque (para <div> no markdown) */
export const HighlightBox = styled.div`
  background: ${({ theme }) => theme.colors.highlightYellow};
  border-left: 4px solid ${({ theme }) => theme.colors.highlightYellowBorder};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: relative;

  p:first-child {
    margin-top: 0;
  }

  p:last-child {
    margin-bottom: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.textDark};
  }

  strong {
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

/* Box de Informação (use com > no markdown) */
export const InfoBox = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary}12 0%,
    ${({ theme }) => theme.colors.secondary}08 100%
  );
  border-left: 4px solid ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};

  &::before {
    content: 'ℹ️';
    margin-right: ${({ theme }) => theme.spacing.sm};
    font-size: 1.2rem;
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

export const TipBox = styled.blockquote`
  background: ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(255, 165, 0, 0.15)' 
    : 'linear-gradient(135deg, #FFF9E6 0%, #FFFAED 100%)'};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 2px 8px ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(255, 165, 0, 0.2)' 
    : 'rgba(255, 165, 0, 0.1)'};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-style: normal;

  .tip-icon {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.accent};
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
  }

  .tip-content {
    flex: 1;
    
    p {
      margin: 0;
      color: ${({ theme }) => theme.colors.textDark};
      font-size: 0.95rem;
      line-height: 1.6;
      
      &:first-child {
        font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
        color: ${({ theme }) => (theme as any).name === 'dark' ? '#FFB84D' : '#CC8400'};
        margin-bottom: ${({ theme }) => theme.spacing.xs};
      }
    }

    strong {
      color: ${({ theme }) => theme.colors.textDark};
    }
  }
`;

export const WarningBox = styled.blockquote`
  background: ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(220, 53, 69, 0.15)' 
    : 'linear-gradient(135deg, #FFF3F3 0%, #FFF5F5 100%)'};
  border-left: 4px solid ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 2px 8px ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(220, 53, 69, 0.2)' 
    : 'rgba(220, 53, 69, 0.1)'};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-style: normal;

  .warning-icon {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.error};
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
  }

  .warning-content {
    flex: 1;
    
    p {
      margin: 0;
      color: ${({ theme }) => theme.colors.textDark};
      font-size: 0.95rem;
      line-height: 1.6;
      
      &:first-child {
        font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
        color: ${({ theme }) => (theme as any).name === 'dark' ? '#FF6B7A' : '#A02834'};
        margin-bottom: ${({ theme }) => theme.spacing.xs};
      }
    }

    strong {
      color: ${({ theme }) => theme.colors.textDark};
    }
  }
`;

export const SuccessBox = styled.blockquote`
  background: ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(40, 167, 69, 0.15)' 
    : theme.colors.highlightGreen};
  border-left: 4px solid ${({ theme }) => theme.colors.highlightGreenBorder};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 2px 8px ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(40, 167, 69, 0.2)' 
    : 'rgba(40, 167, 69, 0.1)'};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-style: normal;

  .success-icon {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.highlightGreenBorder};
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
  }

  .success-content {
    flex: 1;
    
    p {
      margin: 0;
      color: ${({ theme }) => theme.colors.textDark};
      font-size: 0.95rem;
      line-height: 1.6;
      
      &:first-child {
        font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
        color: ${({ theme }) => (theme as any).name === 'dark' ? '#4ADE80' : '#1E7E34'};
        margin-bottom: ${({ theme }) => theme.spacing.xs};
      }
    }

    strong {
      color: ${({ theme }) => theme.colors.textDark};
    }
  }
`;

export const QuoteBox = styled.blockquote`
  background: ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(0, 122, 204, 0.15)' 
    : theme.colors.highlightBlue};
  border-left: 4px solid ${({ theme }) => theme.colors.highlightBlueBorder};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg}
           ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 2px 8px ${({ theme }) => (theme as any).name === 'dark' 
    ? 'rgba(0, 122, 204, 0.2)' 
    : 'rgba(0, 122, 204, 0.08)'};
  position: relative;
  font-style: italic;

  &::before {
    content: '"';
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    top: ${({ theme }) => theme.spacing.sm};
    font-size: 3.5rem;
    font-family: Georgia, serif;
    color: ${({ theme }) => theme.colors.primary};
    opacity: ${({ theme }) => (theme as any).name === 'dark' ? '0.3' : '0.15'};
    line-height: 1;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 1rem;
    line-height: 1.7;
  }

  strong {
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const InlineCode = styled.code`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.88em;
  color: ${({ theme }) => (theme as any).name === 'dark' ? '#FF6B9D' : '#E53935'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

export const ListItem = styled.li`
  position: relative;
  padding-left: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textDark};

  &::marker {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  ul &,
  ol & {
    margin: ${({ theme }) => theme.spacing.xs} 0;
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
