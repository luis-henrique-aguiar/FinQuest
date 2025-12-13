package br.edu.ifsp.prsi.finquest.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("LevelingSystem - Matemática do Jogo")
class LevelingSystemTest {

    // BASE_XP = 100, EXPONENT = 1.15

    @Test
    @DisplayName("Nível 1: Deve começar no nível 1 com 0 pontos")
    void shouldStartAtLevelOne() {
        int level = LevelingSystem.calculateLevel(0);
        assertThat(level).isEqualTo(1);
    }

    @Test
    @DisplayName("Nível 1: Deve permanecer no nível 1 se pontos < 100")
    void shouldStayAtLevelOne() {
        int level = LevelingSystem.calculateLevel(99);
        assertThat(level).isEqualTo(1);
    }

    @Test
    @DisplayName("Level Up: Deve subir para nível 2 ao atingir 100 pontos")
    void shouldLevelUpToTwo() {
        int level = LevelingSystem.calculateLevel(100);
        assertThat(level).isEqualTo(2);
    }

    @ParameterizedTest
    @CsvSource({
            "1, 0",      // Nível 1 precisa de 0 XP total
            "2, 100",    // Nível 2 precisa de 100 XP total
            "3, 221",    // Nível 3 precisa de ~221 XP total (calculado pela fórmula)
            "5, 492",    // Teste de progressão
            "10, 1251"   // Teste de nível mais alto
    })
    @DisplayName("Cálculo de XP necessário para cada nível")
    void shouldCalculateRequiredPointsForLevel(int level, int expectedPoints) {
        // Aceita uma margem de erro pequena de arredondamento (±1)
        int points = LevelingSystem.getFinPointsForLevel(level);
        assertThat(points).isBetween(expectedPoints - 1, expectedPoints + 1);
    }

    @Test
    @DisplayName("Segurança: Níveis negativos ou zero devem retornar 0 pontos")
    void shouldHandleInvalidLevels() {
        assertThat(LevelingSystem.getFinPointsForLevel(0)).isZero();
        assertThat(LevelingSystem.getFinPointsForLevel(-5)).isZero();
    }
}