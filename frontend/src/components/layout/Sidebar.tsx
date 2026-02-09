import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  User,
  Shield,
  Wallet,
} from "lucide-react";
import { useThemeStore } from "../../stores/theme-store";
import { ProgressBar } from "@/features/gamification/components/ProgressBar";
import { useAuth } from "../../hooks/useAuth";
import {
  calculateLevelProgress,
  getFinPointsForLevel,
} from "../../utils/levelingSystem";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, toggleTheme } = useThemeStore();
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  const progressPercent = calculateLevelProgress(user.totalFinPoints);
  const finPointsForNextLevel = getFinPointsForLevel(user.level + 1);

  const avatarSrc =
    user.avatarUrl ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`;

  const navItems = [
    { to: "/home", icon: <Home size={20} />, label: "Home", end: true },
    { to: "/missions", icon: <Target size={20} />, label: "Missões" },
    { to: "/learn", icon: <BookOpen size={20} />, label: "Aprenda" },
    { to: "/planning", icon: <Wallet size={20} />, label: "Planejamento" },
    { to: "/goals", icon: <Award size={20} />, label: "Metas" },
    { to: "/simulator", icon: <TrendingUp size={20} />, label: "Simulador" },
    { to: "/reports", icon: <FileText size={20} />, label: "Relatórios" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[1001] bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:scale-105 transition-transform text-zinc-700 dark:text-zinc-200"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-zinc-900 border-r-2 border-zinc-200 dark:border-zinc-800 z-[1000] flex flex-col transition-transform duration-300 md:translate-x-0 shadow-xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex flex-col items-center p-6 border-b border-zinc-200 dark:border-zinc-800 gap-4 bg-gradient-to-br from-blue-500/10 to-green-500/10 dark:from-blue-900/10 dark:to-green-900/10">
          <div className="relative w-[88px] h-[88px]">
            <img
              src={avatarSrc}
              alt={`Foto de ${user.name}`}
              className="w-full h-full rounded-full object-cover border-[3px] border-[#007ACC] shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute -bottom-1 -right-2 bg-gradient-to-br from-[#007ACC] to-[#28A745] text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm uppercase tracking-wider">
              Nv {user.level}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 text-center max-w-[200px] truncate">
            {user.name}
          </h3>

          <div className="w-[85%] flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>XP para próximo nível</span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <ProgressBar
              progress={progressPercent}
              variant="xp"
              height={8}
              tooltipText={`${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints`}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col p-4 gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative group",
                  isActive
                    ? "bg-gradient-to-br from-blue-500/10 to-green-500/10 text-[#007ACC] font-semibold dark:from-blue-900/20 dark:to-green-900/20"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-[#007ACC]/5 hover:text-[#007ACC] hover:translate-x-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-[#007ACC] rounded-r-sm" />
                  )}
                  <span className={cn(isActive ? "text-[#007ACC]" : "text-current")}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative group",
                isActive
                  ? "bg-gradient-to-br from-blue-500/10 to-green-500/10 text-[#007ACC] font-semibold dark:from-blue-900/20 dark:to-green-900/20"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-[#007ACC]/5 hover:text-[#007ACC] hover:translate-x-1"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-[#007ACC] rounded-r-sm" />
                )}
                <User size={20} />
                <span>Perfil</span>
              </>
            )}
          </NavLink>

          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative group",
                  isActive
                    ? "bg-gradient-to-br from-blue-500/10 to-green-500/10 text-[#007ACC] font-semibold dark:from-blue-900/20 dark:to-green-900/20"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-[#007ACC]/5 hover:text-[#007ACC] hover:translate-x-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-[#007ACC] rounded-r-sm" />
                  )}
                  <Shield size={20} />
                  <span>Admin</span>
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* Footer / Theme Toggle */}
        <div className="p-4 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium hover:border-[#007ACC] hover:text-[#007ACC] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
          >
            {mode === "light" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{mode === "light" ? "Modo Claro" : "Modo Escuro"}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
