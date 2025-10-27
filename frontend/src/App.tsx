import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingPage from "./pages/OnboardingPage";
import { AuthLayout } from "./components/layout/AuthLayout";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

const AppRoutes = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem("finquest_onboarding_completed") === "true";
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem("finquest_onboarding_completed", "true");
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route
          path="*"
          element={<OnboardingPage onComplete={handleOnboardingComplete} />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LandingPage />} />{" "}
        <Route path="/register" element={<RegisterPage />} />{" "}
        <Route path="*" element={<Navigate to="/" />} />{" "}
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
