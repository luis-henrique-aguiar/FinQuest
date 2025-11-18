import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "react-feather";
import { Sun, Moon } from "react-feather";
import { useThemeToggle } from "../../context/ThemeContext";
import ProgressBar from "../gamification/ProgressBar";
import { useAuth } from "../../hooks/useAuth";
import {
  calculateLevelProgress,
  getFinPointsForLevel,
} from "../../utils/levelingSystem";

const ProgressWrapper = styled.div`
  width: 80%;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ThemeToggleContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
`;

const ThemeToggleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}11;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SidebarContainer = styled(motion.div)<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.white};
  z-index: 1000;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textMedium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.2s ease;

  span:first-child {
    font-size: 1.2rem;
  }

  &.active,
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}11;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1001;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid #eaecef;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  align-items: center;
  justify-content: center;

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
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary}33;
`;

const LevelChip = styled.div`
  position: absolute;
  bottom: 0px;
  right: -10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem; // 12px
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
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
  const tooltipMessage = `${user.totalFinPoints.toLocaleString()} / ${finPointsForNextLevel.toLocaleString()} FinPoints`;

  const avatarSrc =
    user.avatarUrl ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`;

  return (
    <>
      <MenuToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            <LevelChip>NÍVEL {user.level}</LevelChip>
          </AvatarContainer>
          <UserName>{user.name}</UserName>

          <ProgressWrapper>
            <ProgressBar
              progress={progressPercent}
              variant="xp"
              height={8}
              tooltipText={tooltipMessage}
            />
          </ProgressWrapper>
        </SidebarHeader>

        <Nav>
          <NavItem to="/home" end onClick={() => setIsOpen(false)}>
            <span>🏠</span>
            <span>Home</span>
          </NavItem>
          <NavItem to="/missions" onClick={() => setIsOpen(false)}>
            <span>🎯</span>
            <span>Missões</span>
          </NavItem>
          <NavItem to="/learn" onClick={() => setIsOpen(false)}>
            <span>📚</span>
            <span>Aprenda</span>
          </NavItem>
          <NavItem to="/budget" onClick={() => setIsOpen(false)}>
            <span>💵</span>
            <span>Orçamento</span>
          </NavItem>
          <NavItem to="/goals" onClick={() => setIsOpen(false)}>
            <span>🏆</span>
            <span>Metas</span>
          </NavItem>
          <NavItem to="/simulator" onClick={() => setIsOpen(false)}>
            <span>📈</span>
            <span>Simulador</span>
          </NavItem>
          <NavItem to="/reports" onClick={() => setIsOpen(false)}>
            <span>📋</span>
            <span>Relatórios</span>
          </NavItem>
          <NavItem to="/profile" onClick={() => setIsOpen(false)}>
            <span>👤</span>
            <span>Perfil</span>
          </NavItem>
          {user?.role === "ADMIN" && (
            <NavItem to="/admin" onClick={() => setIsOpen(false)}>
              <span>🛡️</span>
              <span>Admin</span>
            </NavItem>
          )}
        </Nav>

        <ThemeToggleContainer>
          <ThemeToggleButton onClick={toggleTheme}>
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "light" ? "Modo Claro" : "Modo Escuro"}</span>
          </ThemeToggleButton>
        </ThemeToggleContainer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
