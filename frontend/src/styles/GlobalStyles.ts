import { createGlobalStyle } from 'styled-components';
import { type Theme } from '../styles/theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    color: ${({ theme }) => theme.colors.textDark};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textDark};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.h1};
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
  }
  
  button {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.button};
    cursor: pointer;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

export default GlobalStyles;