import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { AnimatePresence } from "framer-motion";
import { LevelUpModal } from "@/features/gamification/components/LevelUpModal";
import { BadgeUnlockedModal } from "@/features/gamification/components/BadgeUnlockedModal";
import type { BadgeDTO } from "@/features/course/services/lesson-api";

interface GamificationContextType {
  isLevelUpModalOpen: boolean;
  newLevel: number;
  showLevelUp: (level: number) => void;
  closeLevelUpModal: () => void;
  isBadgeModalOpen: boolean;
  badgeData: {
    badge: BadgeDTO;
    newLevel: number;
    totalFinPoints: number;
  } | null;
  showBadgeUnlocked: (
    badge: BadgeDTO,
    newLevel: number,
    totalFinPoints: number
  ) => void;
  closeBadgeModal: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgeData, setBadgeData] = useState<{
    badge: BadgeDTO;
    newLevel: number;
    totalFinPoints: number;
  } | null>(null);

  const showLevelUp = useCallback((level: number) => {
    setNewLevel(level);
    setIsLevelUpModalOpen(true);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelUpModalOpen(false);
  }, []);

  const showBadgeUnlocked = useCallback(
    (badge: BadgeDTO, newLevel: number, totalFinPoints: number) => {
      setBadgeData({ badge, newLevel, totalFinPoints });
      setIsBadgeModalOpen(true);
    },
    []
  );

  const closeBadgeModal = useCallback(() => {
    setIsBadgeModalOpen(false);
    setBadgeData(null);
  }, []);

  const value = {
    isLevelUpModalOpen,
    newLevel,
    showLevelUp,
    closeLevelUpModal,
    isBadgeModalOpen,
    badgeData,
    showBadgeUnlocked,
    closeBadgeModal,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}

      {/* Modal de Level Up (sem badge) */}
      <AnimatePresence>
        {isLevelUpModalOpen && (
          <LevelUpModal newLevel={newLevel} onClose={closeLevelUpModal} />
        )}
      </AnimatePresence>

      {/* Modal de Badge Desbloqueado */}
      <AnimatePresence>
        {isBadgeModalOpen && badgeData && (
          <BadgeUnlockedModal
            badge={badgeData.badge}
            newLevel={badgeData.newLevel}
            totalFinPoints={badgeData.totalFinPoints}
            onClose={closeBadgeModal}
          />
        )}
      </AnimatePresence>
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamification must be used within a GamificationProvider"
    );
  }
  return context;
};
