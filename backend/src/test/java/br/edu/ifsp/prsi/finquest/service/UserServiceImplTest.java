package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("UserService - Testes de Comportamento")
class UserServiceImplTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    // Método auxiliar para criar usuários com todos os campos obrigatórios
    private User createTestUser(String id, String name, String email) {
        User user = new User(id, name, email);
        user.setLevel(1);
        user.setTotalFinPoints(0);
        user.setBudget(BigDecimal.ZERO);
        return user;
    }

    @Test
    @DisplayName("Deve registrar um novo usuário com sucesso")
    void shouldRegisterNewUserSuccessfully() {
        // Given
        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "joao@email.com",
                "João Silva"
        );

        // When
        UserDTO registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.id()).isEqualTo("user123");
        assertThat(registeredUser.name()).isEqualTo("João Silva");
        assertThat(registeredUser.email()).isEqualTo("joao@email.com");
        assertThat(registeredUser.totalFinPoints()).isZero();
        assertThat(registeredUser.budget()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(registeredUser.avatarUrl()).isNull();
        assertThat(registeredUser.level()).isEqualTo(1);

        // Verificar se foi persistido no banco
        User userFromDb = userRepository.findById("user123").orElse(null);
        assertThat(userFromDb).isNotNull();
        assertThat(userFromDb.getEmail()).isEqualTo("joao@email.com");
        assertThat(userFromDb.getLevel()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando ID já existe")
    void shouldThrowBusinessExceptionWhenIdAlreadyExists() {
        // Given
        User existingUser = createTestUser("user123", "Maria", "maria@email.com");
        userRepository.save(existingUser);

        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "joao@email.com",
                "João Silva"
        );

        // When & Then
        assertThatThrownBy(() -> userService.registerUser(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Usuário com ID: user123 já está cadastrado");

        // Verificar que o usuário original não foi alterado
        User userFromDb = userRepository.findById("user123").orElse(null);
        assertThat(userFromDb).isNotNull();
        assertThat(userFromDb.getEmail()).isEqualTo("maria@email.com");
        assertThat(userFromDb.getName()).isEqualTo("Maria");
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando email já existe")
    void shouldThrowBusinessExceptionWhenEmailAlreadyExists() {
        // Given
        User existingUser = createTestUser("user123", "Maria", "joao@email.com");
        userRepository.save(existingUser);

        RegisterUserDTO dto = new RegisterUserDTO(
                "user456",
                "joao@email.com",
                "João Silva"
        );

        // When & Then
        assertThatThrownBy(() -> userService.registerUser(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Email já cadastrado");

        // Verificar que nenhum usuário com o novo ID foi criado
        assertThat(userRepository.findById("user456")).isEmpty();
    }

    @Test
    @DisplayName("Deve permitir registrar usuários com emails diferentes")
    void shouldAllowRegisteringUsersWithDifferentEmails() {
        // Given
        RegisterUserDTO dto1 = new RegisterUserDTO("user1", "joao@email.com", "João");
        RegisterUserDTO dto2 = new RegisterUserDTO("user2", "maria@email.com", "Maria");

        // When
        UserDTO user1 = userService.registerUser(dto1);
        UserDTO user2 = userService.registerUser(dto2);

        // Then
        assertThat(user1.id()).isEqualTo("user1");
        assertThat(user2.id()).isEqualTo("user2");
        assertThat(userRepository.count()).isEqualTo(2);
    }

    @Test
    @DisplayName("Deve encontrar usuário por ID com sucesso")
    void shouldFindUserByIdSuccessfully() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setBudget(BigDecimal.valueOf(500.00));
        user.setTotalFinPoints(50);
        user.setLevel(2);
        user.setAvatarUrl("http://avatar.com/joao.png");
        userRepository.save(user);

        // When
        UserDTO userDTO = userService.findUserById("user123");

        // Then
        assertThat(userDTO).isNotNull();
        assertThat(userDTO.id()).isEqualTo("user123");
        assertThat(userDTO.name()).isEqualTo("João Silva");
        assertThat(userDTO.email()).isEqualTo("joao@email.com");
        assertThat(userDTO.totalFinPoints()).isEqualTo(50);
        assertThat(userDTO.budget()).isEqualByComparingTo(BigDecimal.valueOf(500.00));
        assertThat(userDTO.avatarUrl()).isEqualTo("http://avatar.com/joao.png");
        assertThat(userDTO.level()).isEqualTo(2);
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando usuário não existe")
    void shouldThrowEntityNotFoundExceptionWhenUserDoesNotExist() {
        // When & Then
        assertThatThrownBy(() -> userService.findUserById("idInexistente"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado para o ID: idInexistente");
    }

    @Test
    @DisplayName("Deve inicializar campos numéricos com zero no registro")
    void shouldInitializeNumericFieldsWithZeroOnRegistration() {
        // Given
        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "joao@email.com",
                "João Silva"
        );

        // When
        UserDTO registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser.totalFinPoints()).isZero();
        assertThat(registeredUser.budget()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Deve inicializar avatarUrl como null no registro")
    void shouldInitializeAvatarUrlAsNullOnRegistration() {
        // Given
        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "joao@email.com",
                "João Silva"
        );

        // When
        UserDTO registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser.avatarUrl()).isNull();
    }

    @Test
    @DisplayName("Deve inicializar usuário com level 1 no registro")
    void shouldInitializeUserWithLevel1OnRegistration() {
        // Given
        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "joao@email.com",
                "João Silva"
        );

        // When
        UserDTO registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser.level()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve manter consistência transacional ao registrar usuário")
    void shouldMaintainTransactionalConsistencyWhenRegisteringUser() {
        // Given
        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "joao@email.com",
                "João Silva"
        );

        // When
        userService.registerUser(dto);

        // Then - Verificar se os dados estão corretos após commit da transação
        User userFromDb = userRepository.findById("user123").orElse(null);
        assertThat(userFromDb).isNotNull();
        assertThat(userFromDb.getName()).isEqualTo("João Silva");
        assertThat(userFromDb.getEmail()).isEqualTo("joao@email.com");
        assertThat(userFromDb.getTotalFinPoints()).isZero();
        assertThat(userFromDb.getLevel()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve validar a ordem das validações: ID antes de email")
    void shouldValidateIdBeforeEmail() {
        // Given - Criar um usuário com email duplicado
        User existingUser = createTestUser("user123", "Maria", "duplicado@email.com");
        userRepository.save(existingUser);

        // Tentar registrar com ID duplicado E email duplicado
        RegisterUserDTO dto = new RegisterUserDTO(
                "user123",
                "duplicado@email.com",
                "João Silva"
        );

        // When & Then - Deve falhar por ID duplicado (primeira validação)
        assertThatThrownBy(() -> userService.registerUser(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Usuário com ID: user123");
    }

    // ===== TESTES DO MÉTODO addFinPoints =====

    @Test
    @DisplayName("Deve adicionar pontos de experiência com sucesso")
    void shouldAddFinPointsSuccessfully() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(0);
        user.setLevel(1);
        userRepository.save(user);

        // When
        userService.addFinPoints("user123", 50);

        // Then
        User updatedUser = userRepository.findById("user123").orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(50);
    }

    @Test
    @DisplayName("Deve retornar true quando usuário sobe de nível")
    void shouldReturnTrueWhenUserLevelsUp() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(90); // Perto de subir de nível
        user.setLevel(1);
        userRepository.save(user);

        // When - Adicionar pontos suficientes para subir de nível
        boolean leveledUp = userService.addFinPoints("user123", 20);

        // Then
        assertThat(leveledUp).isTrue();

        User updatedUser = userRepository.findById("user123").orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(110);
        assertThat(updatedUser.getLevel()).isGreaterThan(1);
    }

    @Test
    @DisplayName("Deve retornar false quando usuário não sobe de nível")
    void shouldReturnFalseWhenUserDoesNotLevelUp() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(10);
        user.setLevel(1);
        userRepository.save(user);

        // When - Adicionar poucos pontos (não suficiente para subir)
        boolean leveledUp = userService.addFinPoints("user123", 5);

        // Then
        assertThat(leveledUp).isFalse();

        User updatedUser = userRepository.findById("user123").orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(15);
        assertThat(updatedUser.getLevel()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando usuário não existe ao adicionar pontos")
    void shouldThrowEntityNotFoundExceptionWhenAddingPointsToNonExistentUser() {
        // When & Then
        assertThatThrownBy(() -> userService.addFinPoints("userInexistente", 50))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado: userInexistente");
    }

    @Test
    @DisplayName("Deve acumular pontos corretamente ao adicionar múltiplas vezes")
    void shouldAccumulatePointsCorrectlyWhenAddingMultipleTimes() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(0);
        user.setLevel(1);
        userRepository.save(user);

        // When - Adicionar pontos em múltiplas chamadas
        userService.addFinPoints("user123", 10);
        userService.addFinPoints("user123", 20);
        userService.addFinPoints("user123", 30);

        // Then
        User updatedUser = userRepository.findById("user123").orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(60);
    }

    @Test
    @DisplayName("Deve atualizar nível corretamente baseado nos pontos totais")
    void shouldUpdateLevelCorrectlyBasedOnTotalPoints() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(0);
        user.setLevel(1);
        userRepository.save(user);

        int currentLevel = user.getLevel();

        // When - Adicionar pontos suficientes para múltiplos níveis
        userService.addFinPoints("user123", 500);

        // Then
        User updatedUser = userRepository.findById("user123").orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(500);
        assertThat(updatedUser.getLevel()).isGreaterThan(currentLevel);
    }

    @Test
    @DisplayName("Deve persistir alterações de pontos e nível no banco")
    void shouldPersistPointsAndLevelChangesInDatabase() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(50);
        user.setLevel(1);
        userRepository.save(user);

        // When
        userService.addFinPoints("user123", 100);

        // Then - Verificar se foi persistido corretamente
        User userFromDb = userRepository.findById("user123").orElseThrow();
        assertThat(userFromDb.getTotalFinPoints()).isEqualTo(150);
    }

    @Test
    @DisplayName("Deve adicionar pontos mesmo quando valor é zero")
    void shouldHandleZeroPointsAddition() {
        // Given
        User user = createTestUser("user123", "João Silva", "joao@email.com");
        user.setTotalFinPoints(100);
        user.setLevel(2);
        userRepository.save(user);

        // When
        boolean leveledUp = userService.addFinPoints("user123", 0);

        // Then
        assertThat(leveledUp).isFalse();

        User updatedUser = userRepository.findById("user123").orElseThrow();
        assertThat(updatedUser.getTotalFinPoints()).isEqualTo(100);
        assertThat(updatedUser.getLevel()).isEqualTo(2);
    }
}