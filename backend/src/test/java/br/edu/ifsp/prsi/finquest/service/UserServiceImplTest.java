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
        User registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.getId()).isEqualTo("user123");
        assertThat(registeredUser.getName()).isEqualTo("João Silva");
        assertThat(registeredUser.getEmail()).isEqualTo("joao@email.com");
        assertThat(registeredUser.getTotalFinPoints()).isZero();
        assertThat(registeredUser.getBudget()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(registeredUser.getAvatarUrl()).isNull();

        // Verificar se foi persistido no banco
        User userFromDb = userRepository.findById("user123").orElse(null);
        assertThat(userFromDb).isNotNull();
        assertThat(userFromDb.getEmail()).isEqualTo("joao@email.com");
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando ID já existe")
    void shouldThrowBusinessExceptionWhenIdAlreadyExists() {
        // Given
        User existingUser = new User("user123", "Maria", "maria@email.com");
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
        User existingUser = new User("user123", "Maria", "joao@email.com");
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
        User user1 = userService.registerUser(dto1);
        User user2 = userService.registerUser(dto2);

        // Then
        assertThat(user1.getId()).isEqualTo("user1");
        assertThat(user2.getId()).isEqualTo("user2");
        assertThat(userRepository.count()).isEqualTo(2);
    }

    @Test
    @DisplayName("Deve encontrar usuário por ID com sucesso")
    void shouldFindUserByIdSuccessfully() {
        // Given
        User user = new User("user123", "João Silva", "joao@email.com");
        user.setBudget(BigDecimal.valueOf(500.00));
        user.setTotalFinPoints(50);
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
        User registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser.getTotalFinPoints()).isZero();
        assertThat(registeredUser.getBudget()).isEqualByComparingTo(BigDecimal.ZERO);
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
        User registeredUser = userService.registerUser(dto);

        // Then
        assertThat(registeredUser.getAvatarUrl()).isNull();
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
    }

    @Test
    @DisplayName("Deve validar a ordem das validações: ID antes de email")
    void shouldValidateIdBeforeEmail() {
        // Given - Criar um usuário com email duplicado
        User existingUser = new User("user123", "Maria", "duplicado@email.com");
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
}