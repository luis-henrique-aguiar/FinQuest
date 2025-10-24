import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingPage from "./pages/OnboardingPage";

const AppRoutes = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem("finquest_onboarding_completed") === "true";
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem("finquest_onboarding_completed", "true");
    setHasCompletedOnboarding(true);
  };

  if (true || hasCompletedOnboarding) {
    return (
      <Routes>
        <Route
          path="*"
          element={<OnboardingPage onComplete={handleOnboardingComplete} />}
        />
      </Routes>
    );
  }
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
