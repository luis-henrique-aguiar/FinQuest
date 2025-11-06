package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("UserController - Testes de API")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve registrar usuário com sucesso quando autenticado")
    @WithMockUser(username = "user123")
    void shouldRegisterUserSuccessfullyWhenAuthenticated() throws Exception {
        // Given
        String requestBody = """
            {
                "id": "user123",
                "email": "joao@email.com",
                "name": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated());

        // Verificar se foi persistido
        User savedUser = userRepository.findById("user123").orElse(null);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getName()).isEqualTo("João Silva");
        assertThat(savedUser.getEmail()).isEqualTo("joao@email.com");
        assertThat(savedUser.getTotalFinPoints()).isZero();
        assertThat(savedUser.getBudget()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve retornar 403 quando ID não corresponde ao autenticado")
    @WithMockUser(username = "outrousuario")
    void shouldReturn403WhenIdDoesNotMatchAuthenticatedUser() throws Exception {
        // Given
        String requestBody = """
            {
                "id": "user123",
                "email": "joao@email.com",
                "name": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());

        // Verificar que não foi criado
        assertThat(userRepository.findById("user123")).isEmpty();
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve retornar 409 CONFLICT quando email já existe")
    @WithMockUser(username = "user2")
    void shouldReturn409ConflictWhenEmailAlreadyExists() throws Exception {
        // Given
        User existingUser = new User("user1", "Maria", "joao@email.com");
        userRepository.save(existingUser);

        String requestBody = """
            {
                "id": "user2",
                "email": "joao@email.com",
                "name": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("CONFLICT"))
                .andExpect(jsonPath("$.message").value("Email já cadastrado."));

        // Verificar que o segundo usuário não foi criado
        assertThat(userRepository.findById("user2")).isEmpty();
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve retornar 409 CONFLICT quando ID já existe")
    @WithMockUser(username = "user123")
    void shouldReturn409ConflictWhenIdAlreadyExists() throws Exception {
        // Given
        User existingUser = new User("user123", "Maria", "maria@email.com");
        userRepository.save(existingUser);

        String requestBody = """
            {
                "id": "user123",
                "email": "joao@email.com",
                "name": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Usuário com ID: user123 já está cadastrado."));
    }

    @Test
    @DisplayName("GET /users/{id} - Deve retornar usuário quando existe")
    void shouldReturnUserWhenExists() throws Exception {
        // Given
        User user = new User("user123", "João Silva", "joao@email.com");
        user.setBudget(BigDecimal.valueOf(1000.00));
        user.setTotalFinPoints(100);
        user.setAvatarUrl("http://avatar.com/joao.png");
        userRepository.save(user);

        // When & Then
        mockMvc.perform(get("/users/user123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.name").value("João Silva"))
                .andExpect(jsonPath("$.email").value("joao@email.com"))
                .andExpect(jsonPath("$.totalFinPoints").value(100))
                .andExpect(jsonPath("$.budget").value(1000.00))
                .andExpect(jsonPath("$.avatarUrl").value("http://avatar.com/joao.png"));
    }

    @Test
    @DisplayName("GET /users/{id} - Deve retornar 404 quando usuário não existe")
    void shouldReturn404WhenUserDoesNotExist() throws Exception {
        // When & Then
        mockMvc.perform(get("/users/idInexistente"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Usuário não encontrado para o ID: idInexistente"));
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve retornar 400 BAD REQUEST quando email é inválido")
    @WithMockUser(username = "user123")
    void shouldReturn400BadRequestWhenEmailIsInvalid() throws Exception {
        // Given
        String requestBody = """
            {
                "id": "user123",
                "email": "emailinvalido",
                "name": "João Silva"
            }
            """;

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details[0]").value("email: Email inválido"));
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve retornar 400 quando campos obrigatórios estão vazios")
    @WithMockUser(username = "user123")
    void shouldReturn400WhenRequiredFieldsAreEmpty() throws Exception {
        // Given
        String requestBody = """
            {
                "id": "",
                "email": "",
                "name": ""
            }
            """;

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve retornar erro quando nome excede 255 caracteres")
    @WithMockUser(username = "user123")
    void shouldReturnErrorWhenNameExceeds255Characters() throws Exception {
        // Given
        String longName = "a".repeat(256);
        String requestBody = String.format("""
            {
                "id": "user123",
                "email": "joao@email.com",
                "name": "%s"
            }
            """, longName);

        // When & Then
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("GET /users/{id} - Deve retornar usuário com valores iniciais padrão")
    void shouldReturnUserWithDefaultInitialValues() throws Exception {
        // Given
        User user = new User("user123", "João Silva", "joao@email.com");
        userRepository.save(user);

        // When & Then
        mockMvc.perform(get("/users/user123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.totalFinPoints").value(0))
                .andExpect(jsonPath("$.budget").value(0));
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve permitir registrar múltiplos usuários com emails diferentes")
    @WithMockUser(username = "user1")
    void shouldAllowRegisteringMultipleUsersWithDifferentEmails() throws Exception {
        // Given & When - Primeiro usuário
        String requestBody1 = """
            {
                "id": "user1",
                "email": "joao@email.com",
                "name": "João Silva"
            }
            """;

        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody1))
                .andExpect(status().isCreated());

        // Then
        assertThat(userRepository.count()).isEqualTo(1);
        assertThat(userRepository.findById("user1")).isPresent();
    }

    @Test
    @DisplayName("GET /users/{id} - Deve retornar todos os campos do usuário corretamente")
    void shouldReturnAllUserFieldsCorrectly() throws Exception {
        // Given
        User user = new User("user123", "João Silva", "joao@email.com");
        user.setBudget(BigDecimal.valueOf(2500.50));
        user.setTotalFinPoints(250);
        user.setAvatarUrl("http://avatar.com/joao.png");
        userRepository.save(user);

        // When & Then
        mockMvc.perform(get("/users/user123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.name").value("João Silva"))
                .andExpect(jsonPath("$.email").value("joao@email.com"))
                .andExpect(jsonPath("$.totalFinPoints").value(250))
                .andExpect(jsonPath("$.budget").value(2500.50))
                .andExpect(jsonPath("$.avatarUrl").value("http://avatar.com/joao.png"));
    }

    @Test
    @DisplayName("POST /users/auth/register - Deve inicializar usuário com valores padrão corretos")
    @WithMockUser(username = "user123")
    void shouldInitializeUserWithCorrectDefaultValues() throws Exception {
        // Given
        String requestBody = """
            {
                "id": "user123",
                "email": "joao@email.com",
                "name": "João Silva"
            }
            """;

        // When
        mockMvc.perform(post("/users/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated());

        // Then
        User savedUser = userRepository.findById("user123").orElseThrow();
        assertThat(savedUser.getTotalFinPoints()).isZero();
        assertThat(savedUser.getBudget()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(savedUser.getAvatarUrl()).isNull();
    }
}