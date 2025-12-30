import styled from 'styled-components';

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    height: 500px;
  }
`;

export const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const EditorPane = styled.div<{ isFullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : '50%')};
  border-right: ${({ isFullWidth, theme }) =>
    isFullWidth ? 'none' : `1px solid ${theme.colors.border}`};
  overflow: hidden;
`;

export const PreviewPane = styled.div<{ isFullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : '50%')};
  overflow: hidden;
`;

export const Textarea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  resize: none;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textDark};
  background-color: ${({ theme }) => theme.colors.background};
  outline: none;

  &:focus {
    background-color: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const MarkdownContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.white};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    color: ${({ theme }) => theme.colors.textDark};
    margin-top: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.h1};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.h2};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.h3};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textDark};
  }

  code {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  ul,
  ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    padding-left: ${({ theme }) => theme.spacing.md};
    margin-left: 0;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textMedium};
    font-style: italic;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    margin: ${({ theme }) => theme.spacing.md} 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }
`;
