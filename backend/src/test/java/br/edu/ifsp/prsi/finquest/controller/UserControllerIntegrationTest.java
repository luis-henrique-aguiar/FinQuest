package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserEmailDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserNameDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserPasswordDTO;
import br.edu.ifsp.prsi.finquest.model.Achievement;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserAchievement;
import br.edu.ifsp.prsi.finquest.model.UserAchievementId;
import br.edu.ifsp.prsi.finquest.repository.AchievementRepository;
import br.edu.ifsp.prsi.finquest.repository.UserAchievementRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("UserController - Gestão de Perfil e Conquistas")
class UserControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private AchievementRepository achievementRepository;
    @Autowired private UserAchievementRepository userAchievementRepository;
    @Autowired private ObjectMapper objectMapper;

    private User currentUser;

    @BeforeEach
    void setUp() {
        userAchievementRepository.deleteAll();
        achievementRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Usuário Principal (Logado)
        currentUser = new User("user123", "Current User", "current@finquest.com");
        currentUser.setTotalFinPoints(100);
        currentUser.setLevel(2);
        userRepository.save(currentUser);
    }

    @Test
    @DisplayName("Perfil: Deve retornar dados do usuário incluindo conquistas desbloqueadas")
    @WithMockUser(username = "user123")
    void shouldReturnUserProfileWithAchievements() throws Exception {
        // 1. Configuração: Criar e conceder um Badge
        Achievement badge = new Achievement(null, "Poupador", "Guardou 100 reais", "💰", 1);
        achievementRepository.save(badge);

        UserAchievement userBadge = new UserAchievement();
        userBadge.setId(new UserAchievementId(currentUser.getId(), badge.getId()));
        userBadge.setUser(currentUser);
        userBadge.setAchievement(badge);
        userBadge.setDate(LocalDate.now());
        userAchievementRepository.save(userBadge);

        // 2. Ação: Buscar perfil
        mockMvc.perform(get("/users/{id}", currentUser.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Current User"))
                .andExpect(jsonPath("$.totalFinPoints").value(100))
                .andExpect(jsonPath("$.unlockedAchievements", hasSize(1)))
                .andExpect(jsonPath("$.unlockedAchievements[0].title").value("Poupador"));
    }

    @Test
    @DisplayName("Update: Deve atualizar o NOME com sucesso")
    @WithMockUser(username = "user123")
    void shouldUpdateUserName() throws Exception {
        UpdateUserNameDTO dto = new UpdateUserNameDTO("Novo Nome");

        mockMvc.perform(put("/users/name")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Novo Nome"));

        // Validação no banco
        User updatedUser = userRepository.findById(currentUser.getId()).orElseThrow();
        assertThat(updatedUser.getName()).isEqualTo("Novo Nome");
    }

    @Test
    @DisplayName("Regra de Negócio: Não deve permitir atualizar para um EMAIL já em uso")
    @WithMockUser(username = "user123")
    void shouldReturnConflict_WhenEmailAlreadyExists() throws Exception {
        // 1. Configuração: Criar outro usuário para ocupar o email
        User otherUser = new User("user456", "Other", "busy@finquest.com");
        userRepository.save(otherUser);

        // 2. Ação: Tentar mudar meu email para o do outro
        UpdateUserEmailDTO dto = new UpdateUserEmailDTO("busy@finquest.com");

        mockMvc.perform(put("/users/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict()) // Espera 409 Conflict (BusinessException)
                .andExpect(jsonPath("$.message").value("Este email já está cadastrado no sistema."));
    }

    @Test
    @DisplayName("Segurança/Validação: Não deve permitir senhas divergentes na troca de senha")
    @WithMockUser(username = "user123")
    void shouldReturnConflict_WhenPasswordsDoNotMatch() throws Exception {
        // Ação: Tentar trocar senha com confirmação errada
        UpdateUserPasswordDTO dto = new UpdateUserPasswordDTO("Senha123!", "SenhaErrada!");

        // Nota: O Controller chama o service que valida a igualdade das senhas
        // antes de chamar o Firebase. O Mock do Firebase nem será acionado.
        mockMvc.perform(put("/users/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict()) // BusinessException
                .andExpect(jsonPath("$.message").value("A nova senha e a confirmação não coincidem."));
    }

    @Test
    @DisplayName("Validação: Deve retornar 400 se a nova senha for fraca (Validation Annotation)")
    @WithMockUser(username = "user123")
    void shouldReturnBadRequest_WhenPasswordIsWeak() throws Exception {
        // Ação: Tentar trocar senha para "123"
        UpdateUserPasswordDTO dto = new UpdateUserPasswordDTO("123", "123");

        mockMvc.perform(put("/users/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest()) // 400 Bad Request (Bean Validation)
                .andExpect(jsonPath("$.details").exists()); // Detalhes do erro de validação
    }

    @Test
    @DisplayName("Funcionalidade: Deve atualizar o EMAIL com sucesso")
    @WithMockUser(username = "user123")
    void shouldUpdateUserEmail() throws Exception {
        // Cenário: Email válido e não utilizado
        String newEmail = "new.email@finquest.com";
        UpdateUserEmailDTO dto = new UpdateUserEmailDTO(newEmail);

        // Nota: O TestSecurityConfig já injeta um Mock do FirebaseAuth.
        // Por padrão, mocks do Mockito não lançam erro em métodos void/retorno objeto,
        // então a chamada ao Firebase vai "fingir" que funcionou, permitindo testar a persistência no DB.

        mockMvc.perform(put("/users/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(newEmail));

        // Validação no Banco
        User updatedUser = userRepository.findById(currentUser.getId()).orElseThrow();
        assertThat(updatedUser.getEmail()).isEqualTo(newEmail);
    }

    @Test
    @DisplayName("Funcionalidade: Deve atualizar a SENHA com sucesso (204 No Content)")
    @WithMockUser(username = "user123")
    void shouldUpdatePasswordSuccessfully() throws Exception {
        // Cenário: Senha forte e confirmação igual
        UpdateUserPasswordDTO dto = new UpdateUserPasswordDTO("NewStrongPass123!", "NewStrongPass123!");

        mockMvc.perform(put("/users/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNoContent()); // Espera 204
    }

    @Test
    @DisplayName("Funcionalidade: Deve atualizar o AVATAR com sucesso")
    @WithMockUser(username = "user123")
    void shouldUpdateAvatar() throws Exception {
        // Cenário: URL válida (pode ser base64 ou link http)
        String newAvatarUrl = "https://example.com/avatar.png";
        // Note: Usando string direta no content para simular o JSON simples ou criar um DTO se necessário.
        // Olhando seu código, o endpoint espera um DTO. Vamos assumir UpdateAvatarDTO.
        // Se você não tiver esse DTO criado no teste, crie um JSON manual:
        String jsonBody = """
            {
                "avatarUrl": "%s"
            }
            """.formatted(newAvatarUrl);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/users/avatar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avatarUrl").value(newAvatarUrl));

        // Validação no Banco
        User updatedUser = userRepository.findById(currentUser.getId()).orElseThrow();
        assertThat(updatedUser.getAvatarUrl()).isEqualTo(newAvatarUrl);
    }

    @Test
    @DisplayName("Validação: Não deve permitir Email inválido")
    @WithMockUser(username = "user123")
    void shouldReturnBadRequest_WhenEmailIsInvalid() throws Exception {
        UpdateUserEmailDTO dto = new UpdateUserEmailDTO("email-sem-arroba-ponto-com");

        mockMvc.perform(put("/users/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details").exists());
    }

    @Test
    @DisplayName("Validação: Não deve permitir Nome vazio")
    @WithMockUser(username = "user123")
    void shouldReturnBadRequest_WhenNameIsEmpty() throws Exception {
        UpdateUserNameDTO dto = new UpdateUserNameDTO(""); // Vazio

        mockMvc.perform(put("/users/name")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Robustez: Deve retornar 404 ao buscar usuário inexistente")
    @WithMockUser(username = "user123")
    void shouldReturnNotFound_WhenUserDoesNotExist() throws Exception {
        mockMvc.perform(get("/users/id-fantasma")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("Gamificação: Deve listar TODAS as conquistas indicando quais o usuário desbloqueou")
    @WithMockUser(username = "user123")
    void shouldReturnAllAchievementsWithStatus() throws Exception {
        // 1. Cenário: Existem 2 badges no sistema
        Achievement badge1 = new Achievement(null, "Iniciante", "Começou", "👶", 1);
        Achievement badge2 = new Achievement(null, "Mestre", "Zerou o jogo", "👑", 50);
        achievementRepository.save(badge1);
        achievementRepository.save(badge2);

        // 2. Usuário tem apenas o Badge 1
        UserAchievement userBadge = new UserAchievement();
        userBadge.setId(new UserAchievementId(currentUser.getId(), badge1.getId()));
        userBadge.setUser(currentUser);
        userBadge.setAchievement(badge1);
        userBadge.setDate(LocalDate.now());
        userAchievementRepository.save(userBadge);

        // 3. Ação: Buscar a lista completa
        mockMvc.perform(get("/users/achievements")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                // Valida Badge 1 (Desbloqueado)
                .andExpect(jsonPath("$[?(@.id == " + badge1.getId() + ")].isUnlocked").value(true))
                // Valida Badge 2 (Bloqueado)
                .andExpect(jsonPath("$[?(@.id == " + badge2.getId() + ")].isUnlocked").value(false));
    }
}