import styled, { keyframes } from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  position: sticky;
  border-radius: ${({ theme }) => theme.spacing.md};
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const HeaderContent = styled.div`
  max-width: 1000px;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

export const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);

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
    background: ${({ theme }) => theme.colors.primary}25;
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

  p:first-child { margin-top: 0; }
  p:last-child { margin-bottom: 0; }
`;

export const FooterNavigation = styled.div`
  max-width: 1000px;
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
    animation: ${spin} 1s linear infinite;
  }
`;