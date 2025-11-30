package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.model.Goal;
import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.enums.GoalStatus;
import br.edu.ifsp.prsi.finquest.model.enums.MissionCategory;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import br.edu.ifsp.prsi.finquest.repository.GoalRepository;
import br.edu.ifsp.prsi.finquest.repository.MissionRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("GoalController - Integração Financeira e Gamificação")
class GoalControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private GoalRepository goalRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private MissionRepository missionRepository;
    @Autowired private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        goalRepository.deleteAll();
        userRepository.deleteAll();
        missionRepository.deleteAll();

        // 1. Criar Usuário
        testUser = new User("user123", "Gamer", "gamer@finquest.com");
        testUser.setTotalFinPoints(0);
        testUser.setLevel(1);
        userRepository.save(testUser);

        // 2. Criar Missão de "Completar 1 Meta" para testar a gamificação
        Mission mission = new Mission(
                "MISSION_GOAL_1",
                "Primeira Conquista",
                "Complete 1 meta",
                50, // Recompensa de 50 pontos
                MissionCategory.GOALS,
                MissionTriggerType.GOAL_COMPLETED,
                1 // Target count
        );
        missionRepository.save(mission);
    }

    @Test
    @DisplayName("Fluxo Completo: Criar Meta -> Depositar -> Completar -> Ganhar Pontos")
    @WithMockUser(username = "user123")
    void shouldCompleteGoalAndAwardPoints() throws Exception {
        // PASSO 1: Criar a Meta (Alvo: R$ 100,00)
        String createJson = """
            {
                "name": "Comprar Jogo",
                "targetAmount": 100.00
            }
            """;

        String response = mockMvc.perform(post("/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Extrair ID da meta criada
        String goalId = objectMapper.readTree(response).get("id").asText();

        // PASSO 2: Depositar o valor total (R$ 100,00)
        String depositJson = """
            {
                "amount": 100.00
            }
            """;

        mockMvc.perform(put("/goals/" + goalId + "/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(depositJson))
                .andExpect(status().isOk())
                // Verifica se o DTO de resposta diz que subiu de nível ou ganhou pontos
                .andExpect(jsonPath("$.missionCompletion").isNotEmpty());

        // PASSO 3: Verificações no Banco de Dados (A Prova Real)

        // A. Verifica se a meta está CONCLUÍDA
        Goal goalInDb = goalRepository.findById(goalId).orElseThrow();
        assertThat(goalInDb.getStatus()).isEqualTo(GoalStatus.COMPLETED);
        assertThat(goalInDb.getCurrentAmount()).isEqualByComparingTo("100.00");

        // B. Verifica se o usuário ganhou os PONTOS da missão (Gamificação)
        // Ele tinha 0, a missão dava 50.
        User userInDb = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(userInDb.getTotalFinPoints()).isEqualTo(50);
    }

    @Test
    @DisplayName("Segurança: Não deve permitir depositar em meta de outro usuário")
    @WithMockUser(username = "hacker123") // Usuário diferente do dono da meta
    void shouldPreventDepositOnOthersGoal() throws Exception {
        // Cria meta do usuário original
        Goal goal = new Goal();
        goal.setId("goal-do-admin");
        goal.setUserId(testUser.getId());
        goal.setName("Meta Privada");
        goal.setTargetAmount(BigDecimal.TEN);
        goalRepository.save(goal);

        String depositJson = """
            { "amount": 5.00 }
            """;

        mockMvc.perform(put("/goals/goal-do-admin/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(depositJson))
                .andExpect(status().isConflict()) // Ou 403/404 dependendo da sua impl
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("Validação: Não deve permitir criar meta com valor negativo ou zero")
    @WithMockUser(username = "user123")
    void shouldReturnBadRequest_WhenCreatingInvalidGoal() throws Exception {
        // Cenário: Payload inválido (valor negativo e nome vazio)
        String invalidJson = """
            {
                "name": "",
                "targetAmount": -50.00
            }
            """;

        mockMvc.perform(post("/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest()) // Espera 400
                .andExpect(jsonPath("$.details").exists()); // Verifica se há detalhes do erro de validação
    }

    @Test
    @DisplayName("Regra de Negócio: Não deve permitir depósito negativo")
    @WithMockUser(username = "user123")
    void shouldReturnConflict_WhenDepositingNegativeAmount() throws Exception {
        // Cenário: Criar uma meta válida
        Goal goal = new Goal();
        goal.setId("goal-valid");
        goal.setUserId(testUser.getId());
        goal.setName("Meta Teste");
        goal.setTargetAmount(new BigDecimal("100.00"));
        goalRepository.save(goal);

        // Tentativa de depósito negativo
        String depositJson = """
            { "amount": -10.00 }
            """;

        // No seu Controller, a validação @DecimalMin ou a verificação no Service
        // deve barrar isso. Se for @Valid, retorna 400. Se for BusinessException, retorna 409.
        // Ajuste o status() abaixo conforme sua implementação (assumindo 400 pelo @Valid do DTO)
        mockMvc.perform(put("/goals/goal-valid/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(depositJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Isolamento de Dados: GET /goals deve retornar apenas as metas do usuário logado")
    @WithMockUser(username = "user123")
    void shouldListOnlyAuthenticatedUserGoals() throws Exception {
        // Cenário:
        // Meta do usuário logado ("user123")
        Goal myGoal = new Goal();
        myGoal.setId("my-goal");
        myGoal.setUserId("user123");
        myGoal.setName("Minha Meta");
        myGoal.setTargetAmount(BigDecimal.TEN);
        goalRepository.save(myGoal);

        // Meta de OUTRO usuário ("user999")
        Goal otherGoal = new Goal();
        otherGoal.setId("other-goal");
        otherGoal.setUserId("user999");
        otherGoal.setName("Meta Alheia");
        otherGoal.setTargetAmount(BigDecimal.TEN);
        goalRepository.save(otherGoal);

        // Ação: Listar todas
        mockMvc.perform(get("/goals")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))) // Deve vir apenas 1
                .andExpect(jsonPath("$[0].id").value("my-goal")); // Apenas a minha
    }

    @Test
    @DisplayName("Segurança: Não deve permitir DELETAR meta de outro usuário")
    @WithMockUser(username = "hacker123")
    void shouldPreventDeletingOthersGoal() throws Exception {
        // Cenário: Meta existe, mas pertence ao 'testUser' (user123)
        Goal victimGoal = new Goal();
        victimGoal.setId("victim-goal");
        victimGoal.setUserId(testUser.getId());
        victimGoal.setName("Não me delete");
        victimGoal.setTargetAmount(BigDecimal.TEN);
        goalRepository.save(victimGoal);

        // Ação: Hacker tenta deletar
        mockMvc.perform(delete("/goals/victim-goal"))
                .andExpect(status().isConflict()); // BusinessException (Unauthorized) mapeada para 409

        // Validação: A meta AINDA deve existir no banco
        assertThat(goalRepository.existsById("victim-goal")).isTrue();
    }

    @Test
    @DisplayName("Filtro: Deve listar apenas metas CONCLUÍDAS")
    @WithMockUser(username = "user123")
    void shouldReturnCompletedGoals() throws Exception {
        // Cria meta concluída (Alvo 100, Atual 100)
        Goal completed = new Goal();
        completed.setId("g-completed");
        completed.setUserId(testUser.getId());
        completed.setName("Meta Feita");
        completed.setTargetAmount(new BigDecimal("100.00"));
        completed.setCurrentAmount(new BigDecimal("100.00"));
        completed.setStatus(GoalStatus.COMPLETED);
        goalRepository.save(completed);

        // Cria meta em andamento
        Goal inProgress = new Goal();
        inProgress.setId("g-progress");
        inProgress.setUserId(testUser.getId());
        inProgress.setName("Meta Andando");
        inProgress.setTargetAmount(new BigDecimal("100.00"));
        inProgress.setCurrentAmount(new BigDecimal("50.00"));
        inProgress.setStatus(GoalStatus.IN_PROGRESS);
        goalRepository.save(inProgress);

        // Ação: GET /goals/completed
        mockMvc.perform(get("/goals/completed")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("g-completed"));
    }

    @Test
    @DisplayName("Filtro: Deve listar apenas metas EM ANDAMENTO")
    @WithMockUser(username = "user123")
    void shouldReturnInProgressGoals() throws Exception {
        // Reutiliza lógica acima ou cria novos dados se o teste for isolado
        // ... (Criação dos dados igual ao teste acima) ...
        // Nota: Se usar @Transactional, o banco reseta, então precisa criar de novo aqui.

        Goal inProgress = new Goal();
        inProgress.setId("g-progress-2");
        inProgress.setUserId(testUser.getId());
        inProgress.setName("Andando");
        inProgress.setTargetAmount(new BigDecimal("100"));
        inProgress.setCurrentAmount(BigDecimal.ZERO);
        inProgress.setStatus(GoalStatus.IN_PROGRESS);
        goalRepository.save(inProgress);

        Goal completed = new Goal();
        completed.setId("g-completed-2");
        completed.setUserId(testUser.getId());
        completed.setName("Feita");
        completed.setTargetAmount(new BigDecimal("100"));
        completed.setCurrentAmount(new BigDecimal("100"));
        completed.setStatus(GoalStatus.COMPLETED);
        goalRepository.save(completed);

        mockMvc.perform(get("/goals/inprogress")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("g-progress-2"));
    }
}
