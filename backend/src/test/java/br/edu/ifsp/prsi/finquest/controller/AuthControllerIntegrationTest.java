package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.dto.RegisterRequestDTO;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.ErrorCode;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("AuthController - Registro e Segurança")
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private ObjectMapper objectMapper;

    // Injetamos o Mock que foi configurado no TestSecurityConfig
    @Autowired private FirebaseAuth firebaseAuth;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        // Resetamos o mock do Firebase antes de cada teste para evitar interferências
        Mockito.reset(firebaseAuth);
    }

    @Test
    @DisplayName("Sucesso: Deve registrar usuário no Firebase e no Banco Local")
    void shouldRegisterUserSuccessfully() throws Exception {
        // 1. Configuração do Mock do Firebase
        // Simulamos que o Firebase criou o usuário e retornou um UID
        UserRecord mockRecord = Mockito.mock(UserRecord.class);
        when(mockRecord.getUid()).thenReturn("firebase-uid-123");
        when(firebaseAuth.createUser(any(UserRecord.CreateRequest.class))).thenReturn(mockRecord);

        // 2. Payload Válido (Senha Forte)
        RegisterRequestDTO request = new RegisterRequestDTO(
                "newuser@finquest.com",
                "Novo Usuário",
                "SenhaForte123!"
        );

        // 3. Ação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.uid").value("firebase-uid-123"))
                .andExpect(jsonPath("$.email").value(request.email()));

        // 4. Validação no Banco de Dados (MySQL/H2)
        User savedUser = userRepository.findById("firebase-uid-123").orElseThrow();
        assertThat(savedUser.getEmail()).isEqualTo(request.email());
        assertThat(savedUser.getName()).isEqualTo(request.name());
        assertThat(savedUser.getLevel()).isEqualTo(1); // Nível inicial
    }

    @Test
    @DisplayName("Validação: Deve rejeitar SENHA FRACA (Erro 400)")
    void shouldRejectWeakPassword() throws Exception {
        // Cenário: Senha curta e simples
        RegisterRequestDTO request = new RegisterRequestDTO(
                "weak@finquest.com",
                "Weak User",
                "12345" // Muito curta, sem letra, sem maiúscula
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                // Verifica se a mensagem da anotação @StrongPassword está presente
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("mínimo 6 caracteres")));

        // Garante que não chamou o Firebase
        Mockito.verifyNoInteractions(firebaseAuth);
    }

    @Test
    @DisplayName("Validação: Deve rejeitar EMAIL INVÁLIDO (Erro 400)")
    void shouldRejectInvalidEmail() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "email-sem-formato",
                "User",
                "SenhaForte123!"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Regra de Negócio: Não deve permitir email DUPLICADO (Erro 409)")
    void shouldRejectDuplicateEmail() throws Exception {
        // 1. Configuração: Usuário já existente no banco local
        User existingUser = new User("existing-uid", "Existing", "duplicate@finquest.com");
        userRepository.save(existingUser);

        // 2. Tentativa de registro com mesmo email
        RegisterRequestDTO request = new RegisterRequestDTO(
                "duplicate@finquest.com",
                "Impostor",
                "SenhaForte123!"
        );

        // 3. Ação e Validação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict()) // 409 Conflict
                .andExpect(jsonPath("$.message").value("Email ja cadastrado."));

        // Garante que não tentou criar no Firebase (economia de recurso e segurança)
        Mockito.verifyNoInteractions(firebaseAuth);
    }

    @Test
    @DisplayName("Robustez: Deve tratar erro do Firebase (Ex: Serviço indisponível) retornando 409")
    void shouldHandleFirebaseFailureGracefully() throws Exception {
        // 1. CONFIGURAÇÃO: Criar a exceção real em vez de mockar
        // O FirebaseException tem um construtor público simples: (code, message, cause)
        FirebaseException baseException = new FirebaseException(
                ErrorCode.INTERNAL,
                "Firebase indisponível",
                null
        );

        // Usamos o construtor que aceita a baseException para criar o objeto final
        FirebaseAuthException authException = new FirebaseAuthException(baseException);

        // 2. Configurar o Mock do Firebase para lançar a exceção REAL
        when(firebaseAuth.createUser(any(UserRecord.CreateRequest.class)))
                .thenThrow(authException);

        RegisterRequestDTO request = new RegisterRequestDTO(
                "firebase-down@finquest.com",
                "User",
                "SenhaForte123!"
        );

        // 3. Ação & Validação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict()) // O Service captura e lança BusinessException (409)
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Erro ao criar usuario")));

        // Garante que nada foi salvo no banco local
        assertThat(userRepository.existsByEmail(request.email())).isFalse();
    }

    @Test
    @DisplayName("Validação: Não deve permitir NOME vazio ou em branco")
    void shouldReturnBadRequest_WhenNameIsBlank() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "noname@finquest.com",
                "   ", // Nome inválido (apenas espaços)
                "SenhaForte123!"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    @DisplayName("Validação: Não deve permitir NOME muito longo (> 255 chars)")
    void shouldReturnBadRequest_WhenNameIsTooLong() throws Exception {
        // Gera uma string de 256 caracteres
        String hugeName = "a".repeat(256);

        RegisterRequestDTO request = new RegisterRequestDTO(
                "longname@finquest.com",
                hugeName,
                "SenhaForte123!"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Segurança: Deve rejeitar JSON malformado (Erro 400)")
    void shouldReturnBadRequest_WhenJsonIsMalformed() throws Exception {
        // JSON quebrado (falta fecha chaves)
        String brokenJson = """
            {
                "email": "teste@email.com",
                "password": "SenhaForte123!",
                "name": "Hacker"
            
            """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(brokenJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Segurança: Deve rejeitar Email muito longo (Proteção de DB)")
    void shouldRejectExtremelyLongEmail() throws Exception {
        // Email maior que o VARCHAR(255) do banco
        String hugeEmail = "a".repeat(200) + "@" + "b".repeat(100) + ".com";

        RegisterRequestDTO request = new RegisterRequestDTO(
                hugeEmail,
                "User",
                "SenhaForte123!"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                // Aceitamos qualquer erro de validação no campo 'email'
                // Pode ser "Email inválido" ou "O email deve ter no máximo 255 caracteres"
                .andExpect(jsonPath("$.details").exists());
    }
}