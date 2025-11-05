package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.Course;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.model.UserEnrollmentId;
import br.edu.ifsp.prsi.finquest.repository.CourseRepository;
import br.edu.ifsp.prsi.finquest.repository.UserEnrollmentRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("EnrollmentService - Testes de Comportamento")
class EnrollmentServiceImplTest {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private UserEnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User testUser;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        enrollmentRepository.deleteAll();
        userRepository.deleteAll();
        courseRepository.deleteAll();

        // Criar usuário de teste
        testUser = new User("user123", "João Silva", "joao@email.com");
        userRepository.save(testUser);

        // Criar curso de teste
        testCourse = new Course("course123", "Educação Financeira", "Aprenda a gerenciar suas finanças", "💰", 100);
        courseRepository.save(testCourse);
    }

    @Test
    @DisplayName("Deve matricular usuário em curso com sucesso")
    void shouldEnrollUserInCourseSuccessfully() {
        // When
        boolean result = enrollmentService.enrollUserInCourse("user123", "course123");

        // Then
        assertThat(result).isTrue();

        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course123");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);

        assertThat(enrollment).isNotNull();
        assertThat(enrollment.getUser().getId()).isEqualTo("user123");
        assertThat(enrollment.getCourse().getId()).isEqualTo("course123");
        assertThat(enrollment.getProgress()).isZero();
        assertThat(enrollment.getStartDate()).isEqualTo(LocalDate.now());
        assertThat(enrollment.getCompletionDate()).isNull();
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando usuário não existe")
    void shouldThrowEntityNotFoundExceptionWhenUserDoesNotExist() {
        // When & Then
        assertThatThrownBy(() -> enrollmentService.enrollUserInCourse("userInexistente", "course123"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado com ID: userInexistente");

        // Verificar que nenhuma matrícula foi criada
        assertThat(enrollmentRepository.count()).isZero();
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando curso não existe")
    void shouldThrowEntityNotFoundExceptionWhenCourseDoesNotExist() {
        // When & Then
        assertThatThrownBy(() -> enrollmentService.enrollUserInCourse("user123", "courseInexistente"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Curso não encontrado com ID: courseInexistente");

        // Verificar que nenhuma matrícula foi criada
        assertThat(enrollmentRepository.count()).isZero();
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando usuário já está matriculado no curso")
    void shouldThrowBusinessExceptionWhenUserAlreadyEnrolled() {
        // Given - Matricular usuário primeiro
        enrollmentService.enrollUserInCourse("user123", "course123");

        // When & Then - Tentar matricular novamente
        assertThatThrownBy(() -> enrollmentService.enrollUserInCourse("user123", "course123"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Usuário com user123 já está matriculado no curso");

        // Verificar que só existe uma matrícula
        assertThat(enrollmentRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve permitir que o mesmo usuário se matricule em cursos diferentes")
    void shouldAllowSameUserToEnrollInDifferentCourses() {
        // Given
        Course secondCourse = new Course("course456", "Investimentos", "Aprenda sobre investimentos", "📈", 150);
        courseRepository.save(secondCourse);

        // When
        enrollmentService.enrollUserInCourse("user123", "course123");
        enrollmentService.enrollUserInCourse("user123", "course456");

        // Then
        assertThat(enrollmentRepository.count()).isEqualTo(2);

        UserEnrollmentId enrollment1Id = new UserEnrollmentId("user123", "course123");
        UserEnrollmentId enrollment2Id = new UserEnrollmentId("user123", "course456");

        assertThat(enrollmentRepository.findById(enrollment1Id)).isPresent();
        assertThat(enrollmentRepository.findById(enrollment2Id)).isPresent();
    }

    @Test
    @DisplayName("Deve permitir que usuários diferentes se matriculem no mesmo curso")
    void shouldAllowDifferentUsersToEnrollInSameCourse() {
        // Given
        User secondUser = new User("user456", "Maria Silva", "maria@email.com");
        userRepository.save(secondUser);

        // When
        enrollmentService.enrollUserInCourse("user123", "course123");
        enrollmentService.enrollUserInCourse("user456", "course123");

        // Then
        assertThat(enrollmentRepository.count()).isEqualTo(2);

        UserEnrollmentId enrollment1Id = new UserEnrollmentId("user123", "course123");
        UserEnrollmentId enrollment2Id = new UserEnrollmentId("user456", "course123");

        assertThat(enrollmentRepository.findById(enrollment1Id)).isPresent();
        assertThat(enrollmentRepository.findById(enrollment2Id)).isPresent();
    }

    @Test
    @DisplayName("Deve inicializar matrícula com progresso zero")
    void shouldInitializeEnrollmentWithZeroProgress() {
        // When
        enrollmentService.enrollUserInCourse("user123", "course123");

        // Then
        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course123");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();

        assertThat(enrollment.getProgress()).isZero();
    }

    @Test
    @DisplayName("Deve inicializar matrícula com data de início como data atual")
    void shouldInitializeEnrollmentWithCurrentStartDate() {
        // Given
        LocalDate today = LocalDate.now();

        // When
        enrollmentService.enrollUserInCourse("user123", "course123");

        // Then
        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course123");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();

        assertThat(enrollment.getStartDate()).isEqualTo(today);
    }

    @Test
    @DisplayName("Deve inicializar matrícula com data de conclusão nula")
    void shouldInitializeEnrollmentWithNullCompletionDate() {
        // When
        enrollmentService.enrollUserInCourse("user123", "course123");

        // Then
        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course123");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();

        assertThat(enrollment.getCompletionDate()).isNull();
    }

    @Test
    @DisplayName("Deve manter relacionamento correto entre matrícula, usuário e curso")
    void shouldMaintainCorrectRelationshipBetweenEnrollmentUserAndCourse() {
        // When
        enrollmentService.enrollUserInCourse("user123", "course123");

        // Then
        UserEnrollmentId enrollmentId = new UserEnrollmentId("user123", "course123");
        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();

        assertThat(enrollment.getUser()).isNotNull();
        assertThat(enrollment.getUser().getId()).isEqualTo("user123");
        assertThat(enrollment.getUser().getName()).isEqualTo("João Silva");

        assertThat(enrollment.getCourse()).isNotNull();
        assertThat(enrollment.getCourse().getId()).isEqualTo("course123");
        assertThat(enrollment.getCourse().getTitle()).isEqualTo("Educação Financeira");
    }

    @Test
    @DisplayName("Deve validar existência de usuário antes de verificar curso")
    void shouldValidateUserExistenceBeforeCheckingCourse() {
        // When & Then - Usuário não existe, curso também não existe
        assertThatThrownBy(() -> enrollmentService.enrollUserInCourse("userInexistente", "courseInexistente"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado");
    }
}