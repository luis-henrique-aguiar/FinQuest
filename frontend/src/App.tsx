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
import LessonPage from "./pages/LessonPage";
import RegisterPage from "./pages/RegisterPage";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./layout/ProtectedRoute";
import { AdminRoute } from "./layout/AdminRoute"; 
import HomePage from "./pages/HomePage";
import { PublicOnlyRoute } from "./layout/PublicOnlyRoute";
import AppLayout from "./components/layout/AppLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LearnHubPage from "./pages/LearnHubPage";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import MissionsPage from "./pages/MissionsPage";
import { FinancePlanningPage } from "./pages/FinancePlanning";
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

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <GamificationProvider>
            <Router>
              <AppRoutes />
            </Router>
          </GamificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;