import React, { useState } from "react";
import styled from "styled-components";
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
  DollarSign,
  Award,
  TrendingUp,
  FileText,
  User,
  Shield,
} from "lucide-react";
import { useThemeToggle } from "../../context/ThemeContext";
import ProgressBar from "../gamification/ProgressBar";
import { useAuth } from "../../hooks/useAuth";
import {
  calculateLevelProgress,
  getFinPointsForLevel,
} from "../../utils/levelingSystem";

const SidebarContainer = styled(motion.div)<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 280px;
  background: ${({ theme }) => theme.colors.white};
  border-right: 2px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  gap: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 88px;
  height: 88px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}44;
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.primary}66;
  }
`;

const LevelChip = styled.div`
  position: absolute;
  bottom: -4px;
  right: -8px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserName = styled.h3`
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  text-align: center;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProgressWrapper = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  overflow-y: auto;

  /* Scrollbar estilizada */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.pill};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  position: relative;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}11;
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }

  &.active {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}22 0%,
      ${({ theme }) => theme.colors.accent}22 100%
    );
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 0 ${({ theme }) => theme.borderRadius.small}
        ${({ theme }) => theme.borderRadius.small} 0;
    }
  }
`;

const ThemeToggleContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const ThemeToggleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}11;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: scale(1.1);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Overlay = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 999;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useThemeToggle();
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  const progressPercent = calculateLevelProgress(user.totalFinPoints);
  const finPointsForNextLevel = getFinPointsForLevel(user.level + 1);

  const avatarSrc =
    user.avatarUrl ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`;

  return (
    <>
      <MenuToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </MenuToggle>

      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <AvatarContainer>
            <Avatar src={avatarSrc} alt={`Foto de ${user.name}`} />
            <LevelChip>Nv {user.level}</LevelChip>
          </AvatarContainer>
          <UserName>{user.name}</UserName>

          <ProgressWrapper>
            <ProgressLabel>
              <span>XP para próximo nível</span>
              <span>{progressPercent.toFixed(0)}%</span>
            </ProgressLabel>
            <ProgressBar
              progress={progressPercent}
              variant="xp"
              height={8}
              tooltipText={`${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints`}
            />
          </ProgressWrapper>
        </SidebarHeader>

        <Nav>
          <NavItem to="/home" end onClick={() => setIsOpen(false)}>
            <Home />
            <span>Home</span>
          </NavItem>
          <NavItem to="/missions" onClick={() => setIsOpen(false)}>
            <Target />
            <span>Missões</span>
          </NavItem>
          <NavItem to="/learn" onClick={() => setIsOpen(false)}>
            <BookOpen />
            <span>Aprenda</span>
          </NavItem>
          <NavItem to="/budget" onClick={() => setIsOpen(false)}>
            <DollarSign />
            <span>Orçamento</span>
          </NavItem>
          <NavItem to="/goals" onClick={() => setIsOpen(false)}>
            <Award />
            <span>Metas</span>
          </NavItem>
          <NavItem to="/simulator" onClick={() => setIsOpen(false)}>
            <TrendingUp />
            <span>Simulador</span>
          </NavItem>
          <NavItem to="/reports" onClick={() => setIsOpen(false)}>
            <FileText />
            <span>Relatórios</span>
          </NavItem>

          <Divider />

          <NavItem to="/profile" onClick={() => setIsOpen(false)}>
            <User />
            <span>Perfil</span>
          </NavItem>

          {user?.role === "ADMIN" && (
            <NavItem to="/admin" onClick={() => setIsOpen(false)}>
              <Shield />
              <span>Admin</span>
            </NavItem>
          )}
        </Nav>

        <ThemeToggleContainer>
          <ThemeToggleButton onClick={toggleTheme}>
            {theme === "light" ? <Sun /> : <Moon />}
            <span>{theme === "light" ? "Modo Claro" : "Modo Escuro"}</span>
          </ThemeToggleButton>
        </ThemeToggleContainer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
