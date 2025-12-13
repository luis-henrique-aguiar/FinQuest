package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional // Garante rollback após cada teste
@DisplayName("CourseController - Testes de Integração")
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserEnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserLessonCompletionRepository completionRepository;

    private User user;
    private Course courseEduFinanceira;
    private Course courseInvestimentos;

    @BeforeEach
    void setUp() {
        // Limpeza na ordem correta devido às Foreign Keys
        completionRepository.deleteAll();
        enrollmentRepository.deleteAll();
        lessonRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Massa de dados inicial
        user = new User("user123", "João Silva", "joao@email.com");
        user.setLevel(1);
        user.setTotalFinPoints(0);
        userRepository.save(user);

        courseEduFinanceira = new Course("c1", "Educação Financeira", "Básico", "💰", 100);
        courseInvestimentos = new Course("c2", "Investimentos", "Avançado", "📈", 150);
        courseRepository.save(courseEduFinanceira);
        courseRepository.save(courseInvestimentos);
    }

    // ==================================================================================
    // GET /courses
    // ==================================================================================

    @Test
    @DisplayName("GET /courses - Deve retornar lista com progresso NULL para usuário sem matrículas")
    @WithMockUser(username = "user123") // Simula o usuário logado pelo token
    void shouldReturnCoursesWithNullProgress_WhenNotEnrolled() throws Exception {
        mockMvc.perform(get("/courses")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].id", containsInAnyOrder("c1", "c2")))
                .andExpect(jsonPath("$[0].progress").isEmpty()) // Null no JSON vira inexistente ou null
                .andExpect(jsonPath("$[1].progress").isEmpty());
    }

    @Test
    @DisplayName("GET /courses - Deve retornar progresso correto misturando cursos iniciados e não iniciados")
    @WithMockUser(username = "user123")
    void shouldReturnCorrectProgress_WhenMixedEnrollments() throws Exception {
        // Cenário: Matriculado em c1 com 50%, não matriculado em c2
        createEnrollment(user, courseEduFinanceira, 50);

        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                // Valida curso matriculado
                .andExpect(jsonPath("$[?(@.id == 'c1')].progress").value(50))
                .andExpect(jsonPath("$[?(@.id == 'c1')].title").value("Educação Financeira"))
                // Valida curso NÃO matriculado
                .andExpect(jsonPath("$[?(@.id == 'c2')].progress", contains(nullValue())));
    }

    // ==================================================================================
    // POST /courses/{id}/enroll
    // ==================================================================================

    @Test
    @DisplayName("POST /enroll - Deve matricular usuário com sucesso (201 Created)")
    @WithMockUser(username = "user123")
    void shouldEnrollUserSuccessfully() throws Exception {
        mockMvc.perform(post("/courses/{id}/enroll", courseEduFinanceira.getId()))
                .andExpect(status().isCreated());

        // Validação no Banco (Efeito colateral)
        UserEnrollmentId id = new UserEnrollmentId(user.getId(), courseEduFinanceira.getId());
        UserEnrollment enrollment = enrollmentRepository.findById(id).orElseThrow();

        assertThat(enrollment.getProgress()).isZero();
        assertThat(enrollment.getStartDate()).isEqualTo(LocalDate.now());
    }

    @Test
    @DisplayName("POST /enroll - Deve retornar 404 se o curso não existir")
    @WithMockUser(username = "user123")
    void shouldReturn404_WhenCourseNotFound() throws Exception {
        mockMvc.perform(post("/courses/curso-fantasma/enroll"))
                .andExpect(status().isNotFound()); // O GlobalExceptionHandler deve tratar EntityNotFoundException
    }

    @Test
    @DisplayName("POST /enroll - Deve retornar 409 (Conflict) se já estiver matriculado")
    @WithMockUser(username = "user123")
    void shouldReturn409_WhenAlreadyEnrolled() throws Exception {
        // Pré-condição: Já matriculado
        createEnrollment(user, courseEduFinanceira, 0);

        mockMvc.perform(post("/courses/{id}/enroll", courseEduFinanceira.getId()))
                .andExpect(status().isConflict()) // BusinessException deve virar 409
                .andExpect(jsonPath("$.message").value(containsString("já está matriculado")));
    }

    // ==================================================================================
    // GET /courses/{id}/details
    // ==================================================================================

    @Test
    @DisplayName("GET /details - Deve retornar detalhes com lições ordenadas e status de completude")
    @WithMockUser(username = "user123")
    void shouldReturnDetailsWithLessons_OrderedAndStatus() throws Exception {
        // Cenário: 2 lições. Usuário completou a lição 2, mas não a 1 (tecnicamente possível se a lógica permitir pular)
        Lesson l1 = createLesson("l1", "Intro", 1, courseEduFinanceira);
        Lesson l2 = createLesson("l2", "Avançado", 2, courseEduFinanceira);

        // Usuário completou a lição 2
        createCompletion(user, l2);

        mockMvc.perform(get("/courses/{id}/details", courseEduFinanceira.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Educação Financeira"))
                .andExpect(jsonPath("$.lessons", hasSize(2)))
                // Verifica Ordem
                .andExpect(jsonPath("$.lessons[0].id").value("l1"))
                .andExpect(jsonPath("$.lessons[1].id").value("l2"))
                // Verifica Status
                .andExpect(jsonPath("$.lessons[0].isCompleted").value(false))
                .andExpect(jsonPath("$.lessons[1].isCompleted").value(true));
    }

    // --- Helpers ---
    private void createEnrollment(User user, Course course, int progress) {
        UserEnrollment e = new UserEnrollment();
        e.setId(new UserEnrollmentId(user.getId(), course.getId()));
        e.setUser(user);
        e.setCourse(course);
        e.setProgress(progress);
        e.setStartDate(LocalDate.now());
        enrollmentRepository.save(e);
    }

    private Lesson createLesson(String id, String title, int order, Course course) {
        Lesson l = new Lesson();
        l.setId(id);
        l.setTitle(title);
        l.setLessonOrder(order);
        l.setCourse(course);
        l.setRecFinPoints(10);
        return lessonRepository.save(l);
    }

    private void createCompletion(User user, Lesson lesson) {
        UserLessonCompletion c = new UserLessonCompletion();
        c.setId(new UserLessonCompletionId(user.getId(), lesson.getId()));
        c.setUser(user);
        c.setLesson(lesson);
        c.setCompletedAt(LocalDateTime.now());
        completionRepository.save(c);
    }
}
