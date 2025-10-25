const lightTheme = {
  colors: {
    // Primary colors
    primary: '#007ACC', // Azul Confiança - Main UI elements, headers, navigation
    secondary: '#28A745', // Verde Crescimento - Positive feedback, progress bars
    accent: '#FFCC00', // Amarelo Recompensa - CTAs, achievements, rewards
    
    // Semantic colors
    error: '#DC3545', // Vermelho Alerta - Error feedback, critical alerts
    warning: '#FD7E14', // Laranja Cautela - Warnings, non-critical notifications
    
    // Neutral colors
    textDark: '#333333', // Main text color
    textMedium: '#6C757D', // Secondary text, inactive icons
    background: '#F8F9FA', // Main background color
    white: '#FFFFFF', // Card backgrounds, modals
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
  colors: {
    ...lightTheme.colors,
    textDark: '#EAECEF',     // Texto principal claro
    textMedium: '#AAB1B8',  // Texto secundário um pouco mais escuro
    background: '#121212',  // Fundo principal escuro
    white: '#1E1E1E',       // Cor dos cards em modo escuro
  },
};

export { lightTheme, darkTheme };
export type Theme = typeof lightTheme;