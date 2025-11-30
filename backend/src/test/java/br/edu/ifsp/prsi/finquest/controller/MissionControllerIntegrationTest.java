package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.dto.CreateTransactionDTO;
import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.model.enums.MissionCategory;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.EnrollmentService;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import br.edu.ifsp.prsi.finquest.service.TransactionService;
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
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("MissionController - Gamificação e Segurança")
class MissionControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private MissionRepository missionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserMissionProgressRepository progressRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private LessonService lessonService;
    @Autowired private UserEnrollmentRepository enrollmentRepository;

    // Vamos usar o TransactionService para gerar o "gatilho" real da missão
    @Autowired private TransactionService transactionService;

    private User testUser;
    private Mission transactionMission;

    @BeforeEach
    void setUp() {
        // Limpeza
        progressRepository.deleteAll();
        missionRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Criar Usuário
        testUser = new User("user123", "Player 1", "player1@finquest.com");
        testUser.setTotalFinPoints(0);
        testUser.setLevel(1);
        userRepository.save(testUser);

        // 2. Criar Missão: "Criar 1 Transação"
        transactionMission = new Mission(
                "MISSION_TRANS_1",
                "Primeiros Passos",
                "Crie sua primeira transação",
                100, // Recompensa alta para facilitar teste
                MissionCategory.BUDGET,
                MissionTriggerType.TRANSACTION_CREATED,
                1 // Meta: 1 transação
        );
        missionRepository.save(transactionMission);
    }

    @Test
    @DisplayName("Jornada: Usuário deve receber missão inicial como NOT_STARTED")
    @WithMockUser(username = "user123")
    void shouldReturnInitialMissionState() throws Exception {
        mockMvc.perform(get("/missions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("MISSION_TRANS_1"))
                .andExpect(jsonPath("$[0].status").value("NOT_STARTED"))
                .andExpect(jsonPath("$[0].currentCount").value(0))
                .andExpect(jsonPath("$[0].progressPercentage").value(0));
    }

    @Test
    @DisplayName("Gamificação: Criar transação deve atualizar missão para COMPLETED automaticamente")
    @WithMockUser(username = "user123")
    void shouldCompleteMissionAutomatically() throws Exception {
        // Ação: Usuário cria uma transação (Isso dispara o evento no MissionService)
        transactionService.createTransaction(testUser.getId(), new CreateTransactionDTO(
                "EXPENSE", new BigDecimal("50.00"), "Teste", "Lazer", LocalDate.now().toString(), null
        ));

        // Verificação: Chama o endpoint de missões novamente para ver se atualizou
        mockMvc.perform(get("/missions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("MISSION_TRANS_1"))
                .andExpect(jsonPath("$[0].status").value("COMPLETED")) // Deve estar completa!
                .andExpect(jsonPath("$[0].currentCount").value(1))
                .andExpect(jsonPath("$[0].progressPercentage").value(100));

        // Validação Extra: Usuário ganhou os pontos?
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(100);
    }

    @Test
    @DisplayName("Segurança (Isolamento): Progresso do Usuário A não deve aparecer para o Usuário B")
    @WithMockUser(username = "user456") // Outro usuário logado
    void shouldNotLeakProgressToOtherUsers() throws Exception {
        // 1. Configuração: Cria usuário "intruso"
        User otherUser = new User("user456", "Player 2", "player2@finquest.com");
        userRepository.save(otherUser);

        // 2. Usuário ORIGINAL ("user123") completa a missão
        transactionService.createTransaction(testUser.getId(), new CreateTransactionDTO(
                "EXPENSE", new BigDecimal("50.00"), "Gasto do User 1", "Lazer", LocalDate.now().toString(), null
        ));

        // 3. Ação: Usuário NOVO ("user456") consulta SUAS missões
        // Ele NÃO deve ver a missão como completada, pois quem completou foi o user123
        mockMvc.perform(get("/missions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("MISSION_TRANS_1"))
                .andExpect(jsonPath("$[0].status").value("NOT_STARTED")) // Para ele, ainda é zero
                .andExpect(jsonPath("$[0].currentCount").value(0));
    }

    @Test
    @DisplayName("Robustez: Missão com alvo > 1 deve mostrar progresso parcial (IN_PROGRESS)")
    @WithMockUser(username = "user123")
    void shouldShowPartialProgress() throws Exception {
        // Configuração: Missão difícil (3 transações)
        Mission hardMission = new Mission(
                "MISSION_HARD", "Hard", "Crie 3", 50,
                MissionCategory.BUDGET, MissionTriggerType.TRANSACTION_CREATED, 3
        );
        missionRepository.save(hardMission);

        // Ação: Criar 1 transação (1/3)
        transactionService.createTransaction(testUser.getId(), new CreateTransactionDTO(
                "EXPENSE", new BigDecimal("10.00"), "1/3", "Lazer", LocalDate.now().toString(), null
        ));

        // Verificação
        mockMvc.perform(get("/missions"))
                .andExpect(status().isOk())
                // Filtra a missão difícil na lista
                .andExpect(jsonPath("$[?(@.id == 'MISSION_HARD')].status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$[?(@.id == 'MISSION_HARD')].currentCount").value(1))
                .andExpect(jsonPath("$[?(@.id == 'MISSION_HARD')].progressPercentage").value(33)); // 33%
    }

    @Test
    @DisplayName("Regra de Ouro: Não deve premiar FinPoints duas vezes para a mesma missão")
    @WithMockUser(username = "user123")
    void shouldNotAwardPointsTwiceForSameMission() throws Exception {
        // 1. Cenário: Missão de "Criar 1 Transação" (já criada no setUp)
        // Recompensa configurada no setUp: 100 pontos.

        // 2. Ação: Usuário completa a missão pela primeira vez
        transactionService.createTransaction(testUser.getId(), new CreateTransactionDTO(
                "EXPENSE", new BigDecimal("10.00"), "Transação 1", "Teste", LocalDate.now().toString(), null
        ));

        // Checkpoint: Deve ter 100 pontos
        User userFirstCheck = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(userFirstCheck.getTotalFinPoints()).isEqualTo(100);

        // 3. Ação: Usuário faz mais uma transação (que teoricamente ativaria o gatilho novamente)
        transactionService.createTransaction(testUser.getId(), new CreateTransactionDTO(
                "EXPENSE", new BigDecimal("20.00"), "Transação 2", "Teste", LocalDate.now().toString(), null
        ));

        // 4. Validação: Pontos devem permanecer 100, não ir para 200
        User userFinalCheck = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(userFinalCheck.getTotalFinPoints()).isEqualTo(100);
    }

    @Test
    @DisplayName("Integração Cruzada: Completar Lição também deve atualizar missões")
    @WithMockUser(username = "user123")
    void shouldUpdateMissionOnLessonCompletion() throws Exception {
        // 1. Configuração: Criar Missão de Estudo
        Mission studyMission = new Mission(
                "MISSION_STUDY", "Estudioso", "Complete 1 lição", 50,
                MissionCategory.LEARNING, MissionTriggerType.LESSON_COMPLETED, 1
        );
        missionRepository.save(studyMission);

        // Criar Curso e Lição para o teste
        var course = new br.edu.ifsp.prsi.finquest.model.Course("c1", "Curso Teste", "Desc", "Icon", 100);
        courseRepository.save(course);
        var lesson = new br.edu.ifsp.prsi.finquest.model.Lesson("l1", "Lição 1", 10, course);
        lesson.setLessonOrder(1);
        lessonRepository.save(lesson);

        // 2. Ação: Completar a lição (Simulando via Service ou Controller)
        // Nota: Precisamos matricular antes se sua regra de negócio exigir,
        // mas vamos assumir que o completeLesson já valida ou não exige matrícula explicita para teste unitário rápido.
        // Para garantir, matriculamos:
        UserEnrollment enrollment = new br.edu.ifsp.prsi.finquest.model.UserEnrollment();
        enrollment.setId(new br.edu.ifsp.prsi.finquest.model.UserEnrollmentId(testUser.getId(), course.getId()));
        enrollment.setUser(testUser);
        enrollment.setCourse(course);
        enrollment.setStartDate(LocalDate.now());
        enrollment.setProgress(0);
        enrollmentRepository.save(enrollment); // Descomente se necessário

        lessonService.completeLesson(lesson.getId(), testUser.getId());

        // 3. Verificação
        mockMvc.perform(get("/missions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == 'MISSION_STUDY')].status").value("COMPLETED"));
    }

    @Test
    @DisplayName("UX: Progresso deve travar em 100% e parar de incrementar após conclusão")
    @WithMockUser(username = "user123")
    void shouldCapProgressPercentageAt100() throws Exception {
        // Configuração: Missão de criar 2 transações
        Mission mission = new Mission(
                "MISSION_CAP", "Limite", "Crie 2", 50,
                MissionCategory.BUDGET, MissionTriggerType.TRANSACTION_CREATED, 2
        );
        missionRepository.save(mission);

        // Ação: Criar 5 transações (muito mais que o necessário)
        for (int i = 0; i < 5; i++) {
            transactionService.createTransaction(testUser.getId(), new CreateTransactionDTO(
                    "EXPENSE", new BigDecimal("1.00"), "T" + i, "Teste", LocalDate.now().toString(), null
            ));
        }

        // Verificação
        mockMvc.perform(get("/missions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // CORREÇÃO AQUI: O contador deve parar no alvo (2), não ir até 5
                .andExpect(jsonPath("$[?(@.id == 'MISSION_CAP')].currentCount").value(2))
                .andExpect(jsonPath("$[?(@.id == 'MISSION_CAP')].progressPercentage").value(100));
    }
}