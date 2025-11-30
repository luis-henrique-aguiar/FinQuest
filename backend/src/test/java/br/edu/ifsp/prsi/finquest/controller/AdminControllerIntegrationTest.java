package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.enums.UserRole;
import br.edu.ifsp.prsi.finquest.repository.UserLessonCompletionRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestSecurityConfig.class)
@DisplayName("AdminController - Segurança e Gestão")
class AdminControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private UserLessonCompletionRepository completionRepository;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        completionRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Criar um ADMIN
        adminUser = new User("admin123", "Super Admin", "admin@finquest.com");
        adminUser.setTotalFinPoints(1000);
        adminUser.setLevel(10);
        adminUser.setRole(UserRole.ADMIN); // <--- Importante
        userRepository.save(adminUser);

        // 2. Criar um USUÁRIO COMUM
        regularUser = new User("user456", "Common User", "user@finquest.com");
        regularUser.setTotalFinPoints(50);
        regularUser.setLevel(1);
        regularUser.setRole(UserRole.USER); // <--- Importante
        userRepository.save(regularUser);
    }

    @Test
    @DisplayName("Segurança: Usuário COMUM deve receber 403 Forbidden ao tentar acessar estatísticas")
    @WithMockUser(username = "user456", roles = {"USER"}) // Simula um usuário comum
    void shouldDenyAccessToStatsForNonAdmin() throws Exception {
        mockMvc.perform(get("/admin/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden()); // 403 é o esperado
    }

    @Test
    @DisplayName("Segurança: Usuário COMUM deve receber 403 Forbidden ao tentar listar usuários")
    @WithMockUser(username = "user456", roles = {"USER"})
    void shouldDenyAccessToUserListForNonAdmin() throws Exception {
        mockMvc.perform(get("/admin/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Segurança: Usuário COMUM não pode promover ninguém a admin")
    @WithMockUser(username = "user456", roles = {"USER"})
    void shouldDenyPromoteActionForNonAdmin() throws Exception {
        mockMvc.perform(post("/admin/users/{userId}/promote", adminUser.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Dashboard: ADMIN deve conseguir visualizar estatísticas do sistema")
    @WithMockUser(username = "admin123", roles = {"ADMIN"}) // Simula um Admin
    void shouldReturnSystemStatsForAdmin() throws Exception {
        // Validação
        mockMvc.perform(get("/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(2)) // admin + user
                .andExpect(jsonPath("$.averageFinPoints").isNumber()) // Média (1000+50)/2 = 525
                .andExpect(jsonPath("$.highestLevel").value(10));
    }

    @Test
    @DisplayName("Gestão: ADMIN deve conseguir listar usuários paginados")
    @WithMockUser(username = "admin123", roles = {"ADMIN"})
    void shouldListUsersForAdmin() throws Exception {
        mockMvc.perform(get("/admin/users")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    @DisplayName("Ação Crítica: ADMIN deve conseguir promover um usuário comum")
    @WithMockUser(username = "admin123", roles = {"ADMIN"})
    void shouldPromoteUserToAdmin() throws Exception {
        // Ação: Promover o regularUser
        mockMvc.perform(post("/admin/users/{userId}/promote", regularUser.getId()))
                .andExpect(status().isOk());

        // Verificação no Banco
        User promotedUser = userRepository.findById(regularUser.getId()).orElseThrow();
        assertThat(promotedUser.getRole()).isEqualTo(UserRole.ADMIN);
    }

    // ==================================================================================
    // TESTES DE REGRA DE NEGÓCIO / ROBUSTEZ
    // ==================================================================================

    @Test
    @DisplayName("Robustez: Não deve ser possível promover alguém que JÁ É admin")
    @WithMockUser(username = "admin123", roles = {"ADMIN"})
    void shouldFailWhenPromotingExistingAdmin() throws Exception {
        // Tenta promover a si mesmo ou outro admin
        mockMvc.perform(post("/admin/users/{userId}/promote", adminUser.getId()))
                .andExpect(status().isConflict()) // BusinessException -> 409
                .andExpect(jsonPath("$.message").value("Usuario ja possui role ADMIN."));
    }

    @Test
    @DisplayName("Robustez: Deve retornar 404 ao tentar promover usuário inexistente")
    @WithMockUser(username = "admin123", roles = {"ADMIN"})
    void shouldReturn404WhenPromotingGhost() throws Exception {
        mockMvc.perform(post("/admin/users/fantasma/promote"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Segurança Crítica: Deve retornar 401 Unauthorized para requisições sem token")
        // NOTA: Sem @WithMockUser aqui, simulando um usuário anônimo
    void shouldReturnUnauthorizedForAnonymousUser() throws Exception {
        mockMvc.perform(get("/admin/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized()); // O Spring Security deve barrar antes de chegar no Controller
    }

    @Test
    @DisplayName("Funcionalidade: Deve retornar usuários ordenados alfabeticamente (Paginação)")
    @WithMockUser(username = "admin123", roles = {"ADMIN"})
    void shouldReturnUsersSortedByName() throws Exception {
        // Cenário: Temos 'Super Admin' (admin123) e 'Common User' (user456)
        // Vamos adicionar mais um para testar a ordem: "Alice" (deve vir primeiro)
        User alice = new User("user789", "Alice Wonderland", "alice@finquest.com");
        alice.setTotalFinPoints(0);
        alice.setLevel(1);
        userRepository.save(alice);

        // Ação: Pedir ordenado por nome ASCendente
        mockMvc.perform(get("/admin/users")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sort", "name,asc")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Ordem esperada:
                // 1. Alice Wonderland
                // 2. Common User
                // 3. Super Admin
                .andExpect(jsonPath("$.content[0].name").value("Alice Wonderland"))
                .andExpect(jsonPath("$.content[1].name").value("Common User"))
                .andExpect(jsonPath("$.content[2].name").value("Super Admin"));
    }
}