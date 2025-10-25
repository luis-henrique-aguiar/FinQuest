import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../styles/theme";
import GlobalStyles from "../styles/GlobalStyles";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

type ThemeMode = "light" | "dark";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeToggle = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeToggle must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem("finquest_theme") as ThemeMode;
      return savedTheme === "dark" ? "dark" : "light";
    } catch (error) {
      return "light";
    }
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("finquest_theme", newTheme);
      return newTheme;
    });
  };

  const activeTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={activeTheme}>
        <GlobalStyles theme={activeTheme} />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
