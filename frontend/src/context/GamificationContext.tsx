import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { LevelUpModal } from '../components/gamification/LevelUpModal';

interface GamificationContextType {
  isLevelUpModalOpen: boolean;
  newLevel: number;
  showLevelUp: (level: number) => void;
  closeLevelUpModal: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  const showLevelUp = useCallback((level: number) => {
    setNewLevel(level);
    setIsLevelUpModalOpen(true);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelUpModalOpen(false);
  }, []);

  const value = {
    isLevelUpModalOpen,
    newLevel,
    showLevelUp,
    closeLevelUpModal,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isLevelUpModalOpen && (
          <LevelUpModal newLevel={newLevel} onClose={closeLevelUpModal} />
        )}
      </AnimatePresence>
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};