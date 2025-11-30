package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
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

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("LessonController - Fluxo Educacional")
class LessonControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserLessonCompletionRepository completionRepository;
    @Autowired private UserEnrollmentRepository enrollmentRepository;
    @Autowired private QuestionRepository questionRepository;

    private User testUser;
    private Course course;
    private Lesson lesson1;
    private Lesson lesson2;

    @BeforeEach
    void setUp() {
        // Limpeza (ordem importa por causa das FKs)
        questionRepository.deleteAll();
        completionRepository.deleteAll();
        enrollmentRepository.deleteAll();
        lessonRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Usuário
        testUser = new User("user123", "Student", "student@finquest.com");
        testUser.setTotalFinPoints(0);
        testUser.setLevel(1);
        userRepository.save(testUser);

        // 2. Curso
        course = new Course("c1", "Curso Teste", "Desc", "Icon", 100);
        courseRepository.save(course);

        // 3. Matrícula (Necessária para atualizar o progresso depois)
        UserEnrollment enrollment = new UserEnrollment();
        enrollment.setId(new UserEnrollmentId(testUser.getId(), course.getId()));
        enrollment.setUser(testUser);
        enrollment.setCourse(course);
        enrollment.setStartDate(LocalDate.now());
        enrollment.setProgress(0);
        enrollmentRepository.save(enrollment);

        // 4. Lições (Ordem 1 e 2)
        lesson1 = new Lesson("l1", "Intro", 50, course);
        lesson1.setLessonOrder(1);

        lesson2 = new Lesson("l2", "Advanced", 50, course);
        lesson2.setLessonOrder(2);

        lessonRepository.saveAll(List.of(lesson1, lesson2));
    }

    @Test
    @DisplayName("Navegação: Deve retornar detalhes e indicar corretamente a próxima lição")
    @WithMockUser(username = "user123")
    void shouldReturnLessonDetailsWithNavigation() throws Exception {
        // Ação: Buscar Lição 1
        mockMvc.perform(get("/lessons/l1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Intro"))
                .andExpect(jsonPath("$.nextLessonId").value("l2")) // Deve apontar para a próxima
                .andExpect(jsonPath("$.previousLessonId").isEmpty()); // Não tem anterior
    }

    @Test
    @DisplayName("Progresso: Completar lição deve dar pontos, atualizar curso e marcar como concluída")
    @WithMockUser(username = "user123")
    void shouldCompleteLessonAndAwardPoints() throws Exception {
        // Ação: Completar L1
        mockMvc.perform(post("/lessons/l1/complete")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awardedFinPoints").value(50))
                .andExpect(jsonPath("$.courseProgress").value(50)); // 1 de 2 lições = 50%

        // Verificação no Banco
        // 1. Completou?
        boolean isCompleted = completionRepository.existsById(new UserLessonCompletionId(testUser.getId(), "l1"));
        assertThat(isCompleted).isTrue();

        // 2. Ganhou pontos?
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(50);

        // 3. Progresso do curso atualizou?
        UserEnrollment updatedEnrollment = enrollmentRepository.findById(new UserEnrollmentId(testUser.getId(), course.getId())).orElseThrow();
        assertThat(updatedEnrollment.getProgress()).isEqualTo(50);
    }

    @Test
    @DisplayName("Idempotência: Não deve dar pontos se tentar completar a mesma lição duas vezes")
    @WithMockUser(username = "user123")
    void shouldNotAwardPointsTwice() throws Exception {
        // 1. Completa a primeira vez
        mockMvc.perform(post("/lessons/l1/complete"))
                .andExpect(status().isOk());

        // Checkpoint: 50 pontos
        assertThat(userRepository.findById(testUser.getId()).get().getTotalFinPoints()).isEqualTo(50);

        // 2. Tenta completar de novo (Simulando double-click ou hack)
        // O seu sistema deve retornar erro (409 Conflict) ou sucesso mas sem dar pontos.
        // Baseado no seu código atual (LessonServiceImpl), ele lança BusinessException "Licao ja concluida".
        mockMvc.perform(post("/lessons/l1/complete"))
                .andExpect(status().isConflict()) // Espera 409
                .andExpect(jsonPath("$.message").value("Licao ja concluida."));

        // 3. Pontos não devem ter mudado
        assertThat(userRepository.findById(testUser.getId()).get().getTotalFinPoints()).isEqualTo(50);
    }

    @Test
    @DisplayName("Quiz: Deve retornar perguntas ordenadas e formatadas")
    @WithMockUser(username = "user123")
    void shouldReturnQuizQuestions() throws Exception {
        // Configuração: Criar uma pergunta para a Lição 1
        Question q = new Question();
        q.setLesson(lesson1);
        q.setStatement("Quanto é 1+1?");
        q.setOrder(1);
        q.setExplanation("Matemática básica");

        // Criar alternativas (sem o campo 'order' no construtor se você removeu, ou setando via setter)
        Alternative a1 = new Alternative();
        a1.setQuestion(q);
        a1.setText("2");
        a1.setIsCorrect(true);
        a1.setOrder(1);

        Alternative a2 = new Alternative();
        a2.setQuestion(q);
        a2.setText("3");
        a2.setIsCorrect(false);
        a2.setOrder(2);

        q.setAlternatives(List.of(a1, a2));
        questionRepository.save(q);

        // Ação
        mockMvc.perform(get("/lessons/l1/quiz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].question").value("Quanto é 1+1?"))
                .andExpect(jsonPath("$[0].options[0].letter").value("A")) // Verifica se o DTO gerou letras
                .andExpect(jsonPath("$[0].options[0].text").value("2"))
                .andExpect(jsonPath("$[0].correctAnswer").value("A")); // A resposta certa é a primeira
    }

    @Test
    @DisplayName("Validação: Deve retornar 404 (Not Found) ao tentar acessar lição inexistente")
    @WithMockUser(username = "user123")
    void shouldReturn404_WhenLessonNotFound() throws Exception {
        mockMvc.perform(get("/lessons/licao-fantasma")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()) // O GlobalExceptionHandler deve capturar o EntityNotFoundException
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("Regra de Negócio: Não deve permitir completar lição se o usuário NÃO estiver matriculado no curso")
    @WithMockUser(username = "user123")
    void shouldFailToComplete_WhenNotEnrolled() throws Exception {
        // 1. Configuração: Criar um curso NOVO e uma lição, mas SEM matricular o usuário
        Course newCourse = new Course("c2", "Curso Novo", "Desc", "Icon", 100);
        courseRepository.save(newCourse);

        Lesson newLesson = new Lesson("l99", "Lição Solta", 10, newCourse);
        newLesson.setLessonOrder(1);
        lessonRepository.save(newLesson);

        // 2. Ação: Tentar completar a lição
        // Esperamos um erro 404 ou 409, pois o 'updateCourseProgress' vai falhar ao buscar a matrícula
        mockMvc.perform(post("/lessons/l99/complete")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()) // Baseado no seu LessonServiceImpl linha 2124 (EntityNotFoundException)
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Matricula nao encontrada")));
    }
}