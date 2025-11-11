package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.CourseDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;
import br.edu.ifsp.prsi.finquest.dto.LessonProgressDTO;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserLessonCompletionRepository completionRepository;

    private User testUser;
    private Course course1;
    private Course course2;
    private Course course3;

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
        course1 = new Course("course1", "Educação Financeira Básica", "Fundamentos de finanças", "💰", 100);
        course2 = new Course("course2", "Investimentos", "Aprenda sobre investimentos", "📈", 150);
        course3 = new Course("course3", "Planejamento Financeiro", "Planeje seu futuro", "📊", 200);

        courseRepository.save(course1);
        courseRepository.save(course2);
        courseRepository.save(course3);
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

    // ===== TESTES DE getCoursesForUser =====

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
    @DisplayName("Deve retornar apenas o progresso do usuário solicitado, ignorando outros usuários")
    void shouldReturnOnlyRequestedUserProgressIgnoringOtherUsers() {
        // Given
        User anotherUser = createTestUser("user456", "Maria Silva", "maria@email.com");
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

    // ===== TESTES DE getCourseDetailsForUser =====

    @Test
    @DisplayName("Deve retornar detalhes do curso com lições quando curso existe")
    void shouldReturnCourseDetailsWithLessonsWhenCourseExists() {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Conceitos Básicos", 15, course1);
        lesson2.setLessonOrder(2);
        lessonRepository.save(lesson1);
        lessonRepository.save(lesson2);

        // When
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        assertThat(details).isNotNull();
        assertThat(details.id()).isEqualTo("course1");
        assertThat(details.title()).isEqualTo("Educação Financeira Básica");
        assertThat(details.description()).isEqualTo("Fundamentos de finanças");
        assertThat(details.lessons()).hasSize(2);
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando curso não existe")
    void shouldThrowEntityNotFoundExceptionWhenCourseDoesNotExist() {
        // When & Then
        assertThatThrownBy(() -> courseService.getCourseDetailsForUser("courseInexistente", "user123"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Curso não encontrado: courseInexistente");
    }

    @Test
    @DisplayName("Deve retornar lições ordenadas por lessonOrder")
    void shouldReturnLessonsOrderedByLessonOrder() {
        // Given
        Lesson lesson3 = new Lesson("lesson3", "Avançado", 20, course1);
        lesson3.setLessonOrder(3);
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Intermediário", 15, course1);
        lesson2.setLessonOrder(2);

        // Salvar fora de ordem
        lessonRepository.save(lesson3);
        lessonRepository.save(lesson1);
        lessonRepository.save(lesson2);

        // When
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        List<LessonProgressDTO> lessons = details.lessons();
        assertThat(lessons).hasSize(3);
        assertThat(lessons.get(0).id()).isEqualTo("lesson1");
        assertThat(lessons.get(1).id()).isEqualTo("lesson2");
        assertThat(lessons.get(2).id()).isEqualTo("lesson3");
    }

    @Test
    @DisplayName("Deve marcar lições como completadas quando usuário as completou")
    void shouldMarkLessonsAsCompletedWhenUserCompletedThem() {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Conceitos", 15, course1);
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

        // When
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        LessonProgressDTO lesson1DTO = details.lessons().stream()
                .filter(l -> l.id().equals("lesson1"))
                .findFirst()
                .orElseThrow();
        assertThat(lesson1DTO.isCompleted()).isTrue();

        LessonProgressDTO lesson2DTO = details.lessons().stream()
                .filter(l -> l.id().equals("lesson2"))
                .findFirst()
                .orElseThrow();
        assertThat(lesson2DTO.isCompleted()).isFalse();
    }

    @Test
    @DisplayName("Deve retornar curso sem lições quando não há lições cadastradas")
    void shouldReturnCourseWithoutLessonsWhenNoLessonsExist() {
        // When
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        assertThat(details).isNotNull();
        assertThat(details.id()).isEqualTo("course1");
        assertThat(details.lessons()).isEmpty();
    }

    @Test
    @DisplayName("Deve retornar detalhes do curso independente do usuário estar matriculado")
    void shouldReturnCourseDetailsRegardlessOfEnrollment() {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Introdução", 10, course1);
        lesson1.setLessonOrder(1);
        lessonRepository.save(lesson1);

        // When - Usuário não matriculado
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "userNaoMatriculado");

        // Then
        assertThat(details).isNotNull();
        assertThat(details.lessons()).hasSize(1);
        assertThat(details.lessons().get(0).isCompleted()).isFalse();
    }

    @Test
    @DisplayName("Deve retornar todas as informações corretas das lições")
    void shouldReturnAllCorrectLessonInformation() {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Título da Lição", 25, course1);
        lesson1.setLessonOrder(1);
        lessonRepository.save(lesson1);

        // When
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        LessonProgressDTO lessonDTO = details.lessons().get(0);
        assertThat(lessonDTO.id()).isEqualTo("lesson1");
        assertThat(lessonDTO.title()).isEqualTo("Título da Lição");
        assertThat(lessonDTO.isCompleted()).isFalse();
    }

    @Test
    @DisplayName("Deve retornar múltiplas lições com diferentes estados de conclusão")
    void shouldReturnMultipleLessonsWithDifferentCompletionStates() {
        // Given
        Lesson lesson1 = new Lesson("lesson1", "Lição 1", 10, course1);
        lesson1.setLessonOrder(1);
        Lesson lesson2 = new Lesson("lesson2", "Lição 2", 15, course1);
        lesson2.setLessonOrder(2);
        Lesson lesson3 = new Lesson("lesson3", "Lição 3", 20, course1);
        lesson3.setLessonOrder(3);

        lessonRepository.save(lesson1);
        lessonRepository.save(lesson2);
        lessonRepository.save(lesson3);

        // Completar lesson1 e lesson3
        UserLessonCompletionId completion1Id = new UserLessonCompletionId("user123", "lesson1");
        UserLessonCompletion completion1 = new UserLessonCompletion(
                completion1Id, LocalDateTime.now(), testUser, lesson1
        );
        completionRepository.save(completion1);

        UserLessonCompletionId completion3Id = new UserLessonCompletionId("user123", "lesson3");
        UserLessonCompletion completion3 = new UserLessonCompletion(
                completion3Id, LocalDateTime.now(), testUser, lesson3
        );
        completionRepository.save(completion3);

        // When
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        assertThat(details.lessons()).hasSize(3);
        assertThat(details.lessons().get(0).isCompleted()).isTrue();  // lesson1
        assertThat(details.lessons().get(1).isCompleted()).isFalse(); // lesson2
        assertThat(details.lessons().get(2).isCompleted()).isTrue();  // lesson3
    }

    @Test
    @DisplayName("Deve retornar apenas conclusões do usuário específico")
    void shouldReturnOnlySpecificUserCompletions() {
        // Given
        User anotherUser = createTestUser("user456", "Maria", "maria@email.com");
        userRepository.save(anotherUser);

        Lesson lesson1 = new Lesson("lesson1", "Lição 1", 10, course1);
        lesson1.setLessonOrder(1);
        lessonRepository.save(lesson1);

        // user456 completa a lição
        UserLessonCompletionId completionId = new UserLessonCompletionId("user456", "lesson1");
        UserLessonCompletion completion = new UserLessonCompletion(
                completionId, LocalDateTime.now(), anotherUser, lesson1
        );
        completionRepository.save(completion);

        // When - Buscar para user123 (não completou)
        CourseDetailsDTO details = courseService.getCourseDetailsForUser("course1", "user123");

        // Then
        assertThat(details.lessons().get(0).isCompleted()).isFalse();
    }
}