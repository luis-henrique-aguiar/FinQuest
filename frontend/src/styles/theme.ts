const lightTheme = {
  name: 'light' as const,
  colors: {
    // Primary colors
    primary: '#007ACC', // Azul Confiança - Main UI elements, headers, navigation
    secondary: '#28A745', // Verde Crescimento - Positive feedback, progress bars
    accent: '#FFA500', // Laranja Recompensa - CTAs, achievements, rewards (mudado de amarelo para laranja)
    
    // Semantic colors
    error: '#DC3545', // Vermelho Alerta - Error feedback, critical alerts
    warning: '#FD7E14', // Laranja Cautela - Warnings, non-critical notifications
    success: '#28A745', // Verde Sucesso
    info: '#17A2B8', // Azul Info
    
    // Neutral colors
    textDark: '#333333', // Main text color
    textMedium: '#6C757D', // Secondary text, inactive icons
    textLight: '#9CA3AF', // Tertiary text
    background: '#F8F9FA', // Main background color
    backgroundAlt: '#E9ECEF', // Alternative background
    white: '#FFFFFF', // Card backgrounds, modals
    border: '#DEE2E6', // Borders
    
    // Highlight colors (para boxes especiais)
    highlightYellow: '#FFF3CD', // Fundo amarelo claro
    highlightYellowBorder: '#FFC107', // Borda amarelo
    highlightBlue: '#D1ECF1', // Fundo azul claro
    highlightBlueBorder: '#0C5460', // Borda azul escuro
    highlightGreen: '#D4EDDA', // Fundo verde claro
    highlightGreenBorder: '#28A745', // Borda verde
  },
  
  typography: {
    fontFamily: {
      heading: "'Poppins', sans-serif",
      body: "'Nunito Sans', sans-serif",
    },
    
    fontSize: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      body: '16px',
      quote: '18px',
      button: '16px',
      caption: '14px',
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    pill: '999px',
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  
  animations: {
    fast: '0.2s',
    medium: '0.3s',
    slow: '0.5s',
  },
};

const darkTheme = {
  ...lightTheme,
  name: 'dark' as const,
  colors: {
    ...lightTheme.colors,
    // Text colors
    textDark: '#EAECEF',     // Texto principal claro
    textMedium: '#AAB1B8',  // Texto secundário
    textLight: '#6B7280',   // Texto terciário
    
    // Background colors
    background: '#121212',  // Fundo principal escuro
    backgroundAlt: '#1E1E1E', // Fundo alternativo
    white: '#1E1E1E',       // Cor dos cards em modo escuro
    border: '#2D2D2D',      // Bordas escuras
    
    // Highlight colors ajustados para dark mode
    highlightYellow: '#3D3419', // Fundo amarelo escuro
    highlightYellowBorder: '#FFA500', // Borda laranja brilhante
    highlightBlue: '#1A2B32', // Fundo azul escuro
    highlightBlueBorder: '#17A2B8', // Borda azul clara
    highlightGreen: '#1A2E1F', // Fundo verde escuro
    highlightGreenBorder: '#28A745', // Borda verde brilhante
  },
};

export { lightTheme, darkTheme };
export type Theme = typeof lightTheme;