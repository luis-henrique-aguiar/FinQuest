package br.edu.ifsp.prsi.finquest.utils;

public class LevelingUtil {

    private static final double BASE_XP = 150.0;
    private static final double EXPONENT = 1.5;

    private LevelingUtil() {}

    /**
     * Calcula o total de FinPoints necessários para ATINGIR um determinado nível.
     * (Usado para saber o "teto" do próximo nível)
     */
    public static int getFinPointsForLevel(int level) {
        if (level <= 1) {
            return 0;
        }
        return (int) Math.floor(BASE_XP * Math.pow(level, EXPONENT));
    }

    /**
     * Calcula o Nível em que um usuário DEVERIA ESTAR com base no seu total de pontos.
     * (Usado para verificar se o usuário subiu de nível)
     */
    public static int calculateLevel(int totalFinPoints) {
        if (totalFinPoints < 0) {
            return 1;
        }

        int level = (int) Math.floor(Math.pow(totalFinPoints / BASE_XP, 1.0 / EXPONENT)) + 1;

        return Math.max(1, level);
    }
}