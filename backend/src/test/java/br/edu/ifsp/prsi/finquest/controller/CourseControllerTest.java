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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("CourseController - Testes de API")
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

    private User testUser;
    private Course course1;
    private Course course2;

    @BeforeEach
    void setUp() {
        completionRepository.deleteAll();
        lessonRepository.deleteAll();
        enrollmentRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Criar usuário de teste
        testUser = createTestUser("user123", "João Silva", "joao@email.com");
        userRepository.save(testUser);

        // Criar cursos de teste
        course1 = new Course("course1", "Educação Financeira", "Aprenda finanças", "💰", 100);
        course2 = new Course("course2", "Investimentos", "Aprenda investir", "📈", 150);
        courseRepository.save(course1);
        courseRepository.save(course2);
    }

    private User createTestUser(String id, String name, String email) {
        User user = new User(id, name, email);
        user.setLevel(1);
        user.setTotalFinPoints(0);
        user.setBudget(BigDecimal.ZERO);
        return user;
    }

    private void createEnrollment(String userId, String courseId, int progress) {
        UserEnrollmentId enrollmentId = new UserEnrollmentId(userId, courseId);
        User user = userRepository.findById(userId).orElseThrow();
        Course course = courseRepository.findById(courseId).orElseThrow();

        UserEnrollment enrollment = new UserEnrollment();
        enrollment.setId(enrollmentId);
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setProgress(progress);
        enrollment.setStartDate(LocalDate.now());
        enrollment.setCompletionDate(progress == 100 ? LocalDate.now() : null);

        enrollmentRepository.save(enrollment);
    }

    // ===== TESTES DE GET /courses =====

    @Test
    @DisplayName("GET /courses - Deve retornar todos os cursos com progresso null quando usuário não está matriculado")
    @WithMockUser(username = "user123")
    void shouldReturnAllCoursesWithNullProgressWhenUserNotEnrolled() throws Exception {
        // When & Then
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].title").exists())
                .andExpect(jsonPath("$[0].description").exists())
                .andExpect(jsonPath("$[0].icon").exists())
                .andExpect(jsonPath("$[0].progress").isEmpty())
                .andExpect(jsonPath("$[1].progress").isEmpty());
    }

    @Test
    @DisplayName("GET /courses - Deve retornar cursos com progresso correto quando usuário está matriculado")
    @WithMockUser(username = "user123")
    void shouldReturnCoursesWithCorrectProgressWhenUserEnrolled() throws Exception {
        // Given
        createEnrollment("user123", "course1", 50);
        createEnrollment("user123", "course2", 100);

        // When & Then
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.id=='course1')].progress").value(50))
                .andExpect(jsonPath("$[?(@.id=='course2')].progress").value(100));
    }

    @Test
    @DisplayName("GET /courses - Deve retornar informações completas dos cursos")
    @WithMockUser(username = "user123")
    void shouldReturnCompleteCoursesInformation() throws Exception {
        // When & Then
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("course1"))
                .andExpect(jsonPath("$[0].title").value("Educação Financeira"))
                .andExpect(jsonPath("$[0].description").value("Aprenda finanças"))
                .andExpect(jsonPath("$[0].icon").value("💰"));
    }

    // ===== TESTES DE POST /courses/{courseId}/enroll =====

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Deve matricular usuário em curso com sucesso")
    @WithMockUser(username = "user123")
    void shouldEnrollUserInCourseSuccessfully() throws Exception {
        // When & Then
        mockMvc.perform(post("/courses/course1/enroll"))
                .andExpect(status().isCreated());

        // Verificar se foi persistido
        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course1");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);

        assertThat(enrollment).isNotNull();
        assertThat(enrollment.getUser().getId()).isEqualTo("user123");
        assertThat(enrollment.getCourse().getId()).isEqualTo("course1");
        assertThat(enrollment.getProgress()).isZero();
        assertThat(enrollment.getStartDate()).isEqualTo(LocalDate.now());
    }

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Deve retornar 404 quando curso não existe")
    @WithMockUser(username = "user123")
    void shouldReturn404WhenCourseDoesNotExist() throws Exception {
        // When & Then
        mockMvc.perform(post("/courses/courseInexistente/enroll"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Curso não encontrado com ID: courseInexistente"));
    }

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Deve retornar 404 quando usuário não existe")
    @WithMockUser(username = "userInexistente")
    void shouldReturn404WhenUserDoesNotExist() throws Exception {
        // When & Then
        mockMvc.perform(post("/courses/course1/enroll"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Usuário não encontrado com ID: userInexistente"));
    }

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Deve retornar 409 quando usuário já está matriculado")
    @WithMockUser(username = "user123")
    void shouldReturn409WhenUserAlreadyEnrolled() throws Exception {
        // Given - Matricular primeiro
        createEnrollment("user123", "course1", 25);

        // When & Then
        mockMvc.perform(post("/courses/course1/enroll"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("CONFLICT"))
                .andExpect(jsonPath("$.message").value("Usuário com user123 já está matriculado no curso."));

        // Verificar que só existe uma matrícula
        assertThat(enrollmentRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Deve permitir que usuário se matricule em múltiplos cursos")
    @WithMockUser(username = "user123")
    void shouldAllowUserToEnrollInMultipleCourses() throws Exception {
        // When - Matricular em dois cursos
        mockMvc.perform(post("/courses/course1/enroll"))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/courses/course2/enroll"))
                .andExpect(status().isCreated());

        // Then
        assertThat(enrollmentRepository.count()).isEqualTo(2);

        UserEnrollmentId enrollment1Id = new UserEnrollmentId("user123", "course1");
        UserEnrollmentId enrollment2Id = new UserEnrollmentId("user123", "course2");

        assertThat(enrollmentRepository.findById(enrollment1Id)).isPresent();
        assertThat(enrollmentRepository.findById(enrollment2Id)).isPresent();
    }

    // ===== TESTES DE GET /courses/{courseId}/details =====

    @Test
    @DisplayName("GET /courses/{courseId}/details - Deve retornar detalhes do curso com lições")
    @WithMockUser(username = "user123")
    void shouldReturnCourseDetailsWithLessons() throws Exception {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Conceitos", 15, course1);
        lesson2.setLessonOrder(2);
        lessonRepository.save(lesson1);
        lessonRepository.save(lesson2);

        // When & Then
        mockMvc.perform(get("/courses/course1/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("course1"))
                .andExpect(jsonPath("$.title").value("Educação Financeira"))
                .andExpect(jsonPath("$.description").value("Aprenda finanças"))
                .andExpect(jsonPath("$.lessons", hasSize(2)))
                .andExpect(jsonPath("$.lessons[0].id").value("lesson1"))
                .andExpect(jsonPath("$.lessons[0].title").value("Introdução"))
                .andExpect(jsonPath("$.lessons[0].isCompleted").value(false))
                .andExpect(jsonPath("$.lessons[1].id").value("lesson2"))
                .andExpect(jsonPath("$.lessons[1].title").value("Conceitos"))
                .andExpect(jsonPath("$.lessons[1].isCompleted").value(false));
    }

    @Test
    @DisplayName("GET /courses/{courseId}/details - Deve retornar 404 quando curso não existe")
    @WithMockUser(username = "user123")
    void shouldReturn404WhenCourseDoesNotExistForDetails() throws Exception {
        // When & Then
        mockMvc.perform(get("/courses/courseInexistente/details"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Curso não encontrado: courseInexistente"));
    }

    @Test
    @DisplayName("GET /courses/{courseId}/details - Deve marcar lições como completadas corretamente")
    @WithMockUser(username = "user123")
    void shouldMarkLessonsAsCompletedCorrectly() throws Exception {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Avançado", 15, course1);
        lesson2.setLessonOrder(2);
        lessonRepository.save(lesson1);
        lessonRepository.save(lesson2);

        // Marcar lesson1 como completada
        UserLessonCompletionId completionId = new UserLessonCompletionId("user123", "lesson1");
        UserLessonCompletion completion = new UserLessonCompletion(
                completionId,
                LocalDateTime.now(),
                testUser,
                lesson1
        );
        completionRepository.save(completion);

        // When & Then
        mockMvc.perform(get("/courses/course1/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessons[0].id").value("lesson1"))
                .andExpect(jsonPath("$.lessons[0].isCompleted").value(true))
                .andExpect(jsonPath("$.lessons[1].id").value("lesson2"))
                .andExpect(jsonPath("$.lessons[1].isCompleted").value(false));
    }

    @Test
    @DisplayName("GET /courses/{courseId}/details - Deve retornar curso sem lições quando não há lições")
    @WithMockUser(username = "user123")
    void shouldReturnCourseWithoutLessonsWhenNoLessons() throws Exception {
        // When & Then
        mockMvc.perform(get("/courses/course1/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("course1"))
                .andExpect(jsonPath("$.lessons", hasSize(0)));
    }

    @Test
    @DisplayName("GET /courses - Deve retornar lista vazia quando não há cursos cadastrados")
    @WithMockUser(username = "user123")
    void shouldReturnEmptyListWhenNoCoursesExist() throws Exception {
        // Given
        courseRepository.deleteAll();

        // When & Then
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /courses - Deve retornar apenas progresso do usuário autenticado")
    @WithMockUser(username = "user123")
    void shouldReturnOnlyAuthenticatedUserProgress() throws Exception {
        // Given
        User anotherUser = createTestUser("user456", "Maria Silva", "maria@email.com");
        userRepository.save(anotherUser);

        createEnrollment("user123", "course1", 30);
        createEnrollment("user456", "course1", 80);

        // When & Then
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id=='course1')].progress").value(30));
    }

    @Test
    @DisplayName("GET /courses - Deve retornar cursos com diferentes estados de progresso")
    @WithMockUser(username = "user123")
    void shouldReturnCoursesWithDifferentProgressStates() throws Exception {
        // Given
        Course course3 = new Course("course3", "Planejamento", "Planeje seu futuro", "📊", 200);
        courseRepository.save(course3);

        createEnrollment("user123", "course1", 0);    // Não iniciado
        createEnrollment("user123", "course2", 50);   // Em progresso
        // course3 sem matrícula (null)

        // When & Then
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[?(@.id=='course1')].progress").value(0))
                .andExpect(jsonPath("$[?(@.id=='course2')].progress").value(50))
                .andExpect(jsonPath("$[?(@.id=='course3')].progress").isNotEmpty());
    }

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Fluxo completo de matrícula e visualização")
    @WithMockUser(username = "user123")
    void shouldCompleteEnrollmentAndVisualizationFlow() throws Exception {
        // 1. Verificar cursos sem matrícula
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id=='course1')].progress").isNotEmpty());

        // 2. Matricular no curso
        mockMvc.perform(post("/courses/course1/enroll"))
                .andExpect(status().isCreated());

        // 3. Verificar que agora tem progresso 0
        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id=='course1')].progress").value(0));
    }

    @Test
    @DisplayName("POST /courses/{courseId}/enroll - Deve inicializar matrícula com valores padrão corretos")
    @WithMockUser(username = "user123")
    void shouldInitializeEnrollmentWithCorrectDefaultValues() throws Exception {
        // When
        mockMvc.perform(post("/courses/course1/enroll"))
                .andExpect(status().isCreated());

        // Then
        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course1");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();

        assertThat(enrollment.getProgress()).isZero();
        assertThat(enrollment.getStartDate()).isEqualTo(LocalDate.now());
        assertThat(enrollment.getCompletionDate()).isNull();
    }

    @Test
    @DisplayName("GET /courses/{courseId}/details - Deve retornar lições ordenadas corretamente")
    @WithMockUser(username = "user123")
    void shouldReturnLessonsInCorrectOrder() throws Exception {
        // Given - Salvar fora de ordem
        Lesson lesson3 = new Lesson("lesson3", "Avançado", 20, course1);
        lesson3.setLessonOrder(3);
        Lesson lesson1 = new Lesson("lesson1", "Iniciante", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Intermediário", 15, course1);
        lesson2.setLessonOrder(2);

        lessonRepository.save(lesson3);
        lessonRepository.save(lesson1);
        lessonRepository.save(lesson2);

        // When & Then - Deve retornar ordenado por lessonOrder
        mockMvc.perform(get("/courses/course1/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessons[0].id").value("lesson1"))
                .andExpect(jsonPath("$.lessons[1].id").value("lesson2"))
                .andExpect(jsonPath("$.lessons[2].id").value("lesson3"));
    }

    @Test
    @DisplayName("GET /courses/{courseId}/details - Deve retornar detalhes para usuário não matriculado")
    @WithMockUser(username = "userNaoMatriculado")
    void shouldReturnDetailsForNonEnrolledUser() throws Exception {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        lessonRepository.save(lesson1);

        // When & Then
        mockMvc.perform(get("/courses/course1/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("course1"))
                .andExpect(jsonPath("$.lessons", hasSize(1)))
                .andExpect(jsonPath("$.lessons[0].isCompleted").value(false));
    }
}