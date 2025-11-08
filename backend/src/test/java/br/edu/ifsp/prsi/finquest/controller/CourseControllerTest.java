package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.model.Course;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.model.UserEnrollmentId;
import br.edu.ifsp.prsi.finquest.repository.CourseRepository;
import br.edu.ifsp.prsi.finquest.repository.UserEnrollmentRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
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

import java.time.LocalDate;

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

    private User testUser;
    private Course course1;
    private Course course2;

    @BeforeEach
    void setUp() {
        enrollmentRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Criar usuário de teste
        testUser = new User("user123", "João Silva", "joao@email.com");
        userRepository.save(testUser);

        // Criar cursos de teste
        course1 = new Course("course1", "Educação Financeira", "Aprenda finanças", "💰", 100);
        course2 = new Course("course2", "Investimentos", "Aprenda investir", "📈", 150);
        courseRepository.save(course1);
        courseRepository.save(course2);
    }

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
        User anotherUser = new User("user456", "Maria Silva", "maria@email.com");
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

    // Método auxiliar para criar matrículas
    private void createEnrollment(String userId, String courseId, Integer progress) {
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
}