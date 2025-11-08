package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;
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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("CourseService - Testes de Comportamento")
class CourseServiceImplTest {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserEnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Course course1;
    private Course course2;
    private Course course3;

    @BeforeEach
    void setUp() {
        enrollmentRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Criar usuário de teste
        testUser = new User("user123", "João Silva", "joao@email.com");
        userRepository.save(testUser);

        // Criar cursos de teste
        course1 = new Course("course1", "Educação Financeira Básica", "Fundamentos de finanças", "💰", 100);
        course2 = new Course("course2", "Investimentos", "Aprenda sobre investimentos", "📈", 150);
        course3 = new Course("course3", "Planejamento Financeiro", "Planeje seu futuro", "📊", 200);

        courseRepository.save(course1);
        courseRepository.save(course2);
        courseRepository.save(course3);
    }

    @Test
    @DisplayName("Deve retornar todos os cursos com progresso null quando usuário não está matriculado em nenhum")
    void shouldReturnAllCoursesWithNullProgressWhenUserNotEnrolled() {
        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        assertThat(courses).hasSize(3);
        assertThat(courses).allMatch(course -> course.progress() == null);

        assertThat(courses).extracting(CourseProgressDTO::id)
                .containsExactlyInAnyOrder("course1", "course2", "course3");
    }

    @Test
    @DisplayName("Deve retornar cursos com progresso correto quando usuário está matriculado")
    void shouldReturnCoursesWithCorrectProgressWhenUserEnrolled() {
        // Given - Matricular usuário em alguns cursos com diferentes progressos
        createEnrollment("user123", "course1", 50);
        createEnrollment("user123", "course2", 100);

        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        assertThat(courses).hasSize(3);

        CourseProgressDTO course1DTO = courses.stream()
                .filter(c -> c.id().equals("course1"))
                .findFirst()
                .orElseThrow();
        assertThat(course1DTO.progress()).isEqualTo(50);

        CourseProgressDTO course2DTO = courses.stream()
                .filter(c -> c.id().equals("course2"))
                .findFirst()
                .orElseThrow();
        assertThat(course2DTO.progress()).isEqualTo(100);

        CourseProgressDTO course3DTO = courses.stream()
                .filter(c -> c.id().equals("course3"))
                .findFirst()
                .orElseThrow();
        assertThat(course3DTO.progress()).isNull();
    }

    @Test
    @DisplayName("Deve retornar informações completas dos cursos")
    void shouldReturnCompleteCoursesInformation() {
        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        CourseProgressDTO course1DTO = courses.stream()
                .filter(c -> c.id().equals("course1"))
                .findFirst()
                .orElseThrow();

        assertThat(course1DTO.id()).isEqualTo("course1");
        assertThat(course1DTO.title()).isEqualTo("Educação Financeira Básica");
        assertThat(course1DTO.description()).isEqualTo("Fundamentos de finanças");
        assertThat(course1DTO.icon()).isEqualTo("💰");
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há cursos cadastrados")
    void shouldReturnEmptyListWhenNoCoursesExist() {
        // Given
        courseRepository.deleteAll();

        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        assertThat(courses).isEmpty();
    }

    @Test
    @DisplayName("Deve retornar todos os cursos mesmo quando usuário não existe")
    void shouldReturnAllCoursesEvenWhenUserDoesNotExist() {
        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("userInexistente");

        // Then
        assertThat(courses).hasSize(3);
        assertThat(courses).allMatch(course -> course.progress() == null);
    }

    @Test
    @DisplayName("Deve retornar progresso zero quando usuário está matriculado mas não iniciou o curso")
    void shouldReturnZeroProgressWhenUserEnrolledButNotStarted() {
        // Given
        createEnrollment("user123", "course1", 0);

        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        CourseProgressDTO course1DTO = courses.stream()
                .filter(c -> c.id().equals("course1"))
                .findFirst()
                .orElseThrow();

        assertThat(course1DTO.progress()).isZero();
    }

    @Test
    @DisplayName("Deve retornar múltiplos cursos com diferentes estados de progresso")
    void shouldReturnMultipleCoursesWithDifferentProgressStates() {
        // Given
        createEnrollment("user123", "course1", 0);    // Não iniciado
        createEnrollment("user123", "course2", 50);   // Em progresso
        createEnrollment("user123", "course3", 100);  // Completo

        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        assertThat(courses).hasSize(3);

        assertThat(courses).extracting(CourseProgressDTO::progress)
                .containsExactlyInAnyOrder(0, 50, 100);
    }

    @Test
    @DisplayName("Deve manter consistência ao retornar cursos após múltiplas matrículas")
    void shouldMaintainConsistencyWhenReturningCoursesAfterMultipleEnrollments() {
        // Given
        createEnrollment("user123", "course1", 25);

        // When - Primeira chamada
        List<CourseProgressDTO> courses1 = courseService.getCoursesForUser("user123");

        // Given - Adicionar mais uma matrícula
        createEnrollment("user123", "course2", 75);

        // When - Segunda chamada
        List<CourseProgressDTO> courses2 = courseService.getCoursesForUser("user123");

        // Then
        assertThat(courses1).hasSize(3);
        assertThat(courses2).hasSize(3);

        CourseProgressDTO course1FirstCall = courses1.stream()
                .filter(c -> c.id().equals("course1"))
                .findFirst()
                .orElseThrow();
        assertThat(course1FirstCall.progress()).isEqualTo(25);

        CourseProgressDTO course2SecondCall = courses2.stream()
                .filter(c -> c.id().equals("course2"))
                .findFirst()
                .orElseThrow();
        assertThat(course2SecondCall.progress()).isEqualTo(75);
    }

    @Test
    @DisplayName("Deve retornar apenas o progresso do usuário solicitado, ignorando outros usuários")
    void shouldReturnOnlyRequestedUserProgressIgnoringOtherUsers() {
        // Given
        User anotherUser = new User("user456", "Maria Silva", "maria@email.com");
        userRepository.save(anotherUser);

        createEnrollment("user123", "course1", 30);
        createEnrollment("user456", "course1", 80);
        createEnrollment("user456", "course2", 60);

        // When
        List<CourseProgressDTO> coursesUser123 = courseService.getCoursesForUser("user123");

        // Then
        CourseProgressDTO course1User123 = coursesUser123.stream()
                .filter(c -> c.id().equals("course1"))
                .findFirst()
                .orElseThrow();
        assertThat(course1User123.progress()).isEqualTo(30);

        CourseProgressDTO course2User123 = coursesUser123.stream()
                .filter(c -> c.id().equals("course2"))
                .findFirst()
                .orElseThrow();
        assertThat(course2User123.progress()).isNull();
    }

    @Test
    @DisplayName("Deve retornar cursos ordenados conforme inserção no banco")
    void shouldReturnCoursesAsStoredInDatabase() {
        // Given
        createEnrollment("user123", "course2", 50);

        // When
        List<CourseProgressDTO> courses = courseService.getCoursesForUser("user123");

        // Then
        assertThat(courses).hasSize(3);
        assertThat(courses).extracting(CourseProgressDTO::id)
                .contains("course1", "course2", "course3");
    }

    // Método auxiliar para criar matrículas
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
}