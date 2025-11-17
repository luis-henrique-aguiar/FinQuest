const BASE_XP = 100; // Nível 2 começa em 100
const EXPONENT = 1.15;

export const getFinPointsForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, EXPONENT));
};

/**
 * Calcula o nível atual de um usuário com base no seu FinPoints total.
 */
export const calculateLevel = (currentFinPoints: number): number => {
  if (currentFinPoints < BASE_XP) return 1; 
  return Math.floor(Math.pow(currentFinPoints / BASE_XP, 1 / EXPONENT)) + 1;
};

/**
 * Calcula a porcentagem de progresso de FinPoints para o próximo nível.
 */
export const calculateLevelProgress = (currentFinPoints: number): number => {
  const currentLevel = calculateLevel(currentFinPoints);
  const finPointsForCurrentLevel = getFinPointsForLevel(currentLevel);
  const finPointsForNextLevel = getFinPointsForLevel(currentLevel + 1);

  if (finPointsForNextLevel === finPointsForCurrentLevel) return 100;

  const progress =
    ((currentFinPoints - finPointsForCurrentLevel) /
      (finPointsForNextLevel - finPointsForCurrentLevel)) *
    100;
  return Math.min(progress, 100);
};