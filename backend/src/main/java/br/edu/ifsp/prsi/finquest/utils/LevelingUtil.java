package br.edu.ifsp.prsi.finquest.utils;

public class LevelingUtil {

    private static final double BASE_XP = 100.0;
    private static final double EXPONENT = 1.15;

    private LevelingUtil() {}

    /**
     * Calcula o total de FinPoints necessários para ATINGIR (ter como piso) um determinado nível.
     */
    public static int getFinPointsForLevel(int level) {
        if (level <= 1) {
            return 0;
        }
        return (int) Math.floor(BASE_XP * Math.pow(level - 1.0, EXPONENT));
    }

    /**
     * Calcula o Nível em que um usuário DEVERIA ESTAR com base no seu total de pontos.
     */
    public static int calculateLevel(int totalFinPoints) {
        if (totalFinPoints < BASE_XP) {
            return 1;
        }
        
        double level = Math.pow(totalFinPoints / BASE_XP, 1.0 / EXPONENT) + 1;
        return (int) Math.floor(level);
    }
}