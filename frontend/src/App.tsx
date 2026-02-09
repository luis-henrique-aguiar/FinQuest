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
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/stores/theme-store";
import OnboardingPage from "./pages/OnboardingPage";
import { AuthLayout } from "./components/layout/AuthLayout";
import LandingPage from "./pages/LandingPage";
import LessonPage from "./pages/LessonPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { AdminRoute } from "./features/auth/components/AdminRoute";
import HomePage from "./pages/HomePage";
import { PublicOnlyRoute } from "./features/auth/components/PublicOnlyRoute";
import AppLayout from "./components/layout/AppLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LearnHubPage from "./pages/LearnHubPage";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import MissionsPage from "./pages/MissionsPage";
import { FinancePlanningPage } from "./pages/FinancePlanningPage";
import GoalsPage from "./pages/GoalsPage";
import InvestmentSimulatorPage from "./pages/InvestmentSimulatorPage";
import ReportsPage from "./pages/ReportsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { GamificationProvider } from "./context/GamificationContext";

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
      {/* Rotas Públicas */}
      <Route element={<AuthLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Rotas Protegidas (Usuários Autenticados) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/learn" element={<LearnHubPage />} />
          <Route path="/learn/:courseId" element={<CourseDetailsPage />} />
          <Route path="/learn/:courseId/:lessonId" element={<LessonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/planning" element={<FinancePlanningPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/simulator" element={<InvestmentSimulatorPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Rotas de Admin (Apenas ADMIN) */}
      <Route element={<AdminRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

/**
 * App Component
 * 
 * Main application component using Zustand for state management.
 * 
 * State Management:
 * - Theme: useThemeStore (Zustand) - replaces ThemeContext
 * - Toast: Sonner Toaster component - replaces ToastContext
 * - Auth: useAuthStore (Zustand) - replaces AuthContext
 * - Gamification: Still uses GamificationContext (TODO: migrate to Zustand)
 */
function App() {
  const mode = useThemeStore((state) => state.mode);

  // Apply dark mode class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <>
      {/* Toast notifications */}
      <Toaster />

      {/* Keep GamificationProvider for now (will migrate later) */}
      <GamificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </GamificationProvider>
    </>
  );
}

export default App;