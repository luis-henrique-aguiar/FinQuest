package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.config.TestSecurityConfig;
import br.edu.ifsp.prsi.finquest.dto.CreateTransactionDTO;
import br.edu.ifsp.prsi.finquest.model.Transaction;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.enums.TransactionType;
import br.edu.ifsp.prsi.finquest.repository.TransactionRepository;
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

import java.math.BigDecimal;
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
@DisplayName("TransactionController - API Financeira e Relatórios")
class TransactionControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User("user123", "Investor", "money@finquest.com");
        testUser.setTotalFinPoints(0);
        testUser.setLevel(1);
        userRepository.save(testUser);
    }

    // ==================================================================================
    // TESTES DE CRIAÇÃO (POST)
    // ==================================================================================

    @Test
    @DisplayName("Sucesso: Deve criar transação e retornar 201 Created")
    @WithMockUser(username = "user123")
    void shouldCreateTransaction() throws Exception {
        CreateTransactionDTO dto = new CreateTransactionDTO(
                "INCOME",
                new BigDecimal("1500.50"),
                "Freelance",
                "Trabalho",
                "2025-11-30",
                "Pagamento extra"
        );

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transaction.amount").value(1500.50))
                .andExpect(jsonPath("$.transaction.type").value("INCOME"));

        // Validação no Banco
        assertThat(transactionRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("Validação: Deve rejeitar transação com DATA inválida (Erro 400)")
    @WithMockUser(username = "user123")
    void shouldRejectInvalidDateFormat() throws Exception {
        // DTO com data errada (dd/MM/yyyy em vez de yyyy-MM-dd)
        String invalidJson = """
            {
                "type": "EXPENSE",
                "amount": 50.00,
                "description": "Erro",
                "category": "Teste",
                "date": "30/11/2025"
            }
            """;

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest()) // @Pattern no DTO deve pegar
                .andExpect(jsonPath("$.details").exists());
    }

    // ==================================================================================
    // TESTES DE RELATÓRIOS (GET com Parâmetros)
    // ==================================================================================

    @Test
    @DisplayName("Overview: Deve calcular totais corretamente via API")
    @WithMockUser(username = "user123")
    void shouldReturnFinancialOverview() throws Exception {
        // Cenário: 1 Receita e 1 Despesa no mês atual
        LocalDate today = LocalDate.now();
        createTransaction("INCOME", "1000.00", today);
        createTransaction("EXPENSE", "200.00", today);

        // URL com parâmetros de data
        String url = String.format("/transactions/overview?startDate=%s&endDate=%s",
                today.withDayOfMonth(1), today.withDayOfMonth(today.lengthOfMonth()));

        mockMvc.perform(get(url)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome").value(1000.0))
                .andExpect(jsonPath("$.totalExpense").value(200.0))
                .andExpect(jsonPath("$.balance").value(800.0));
    }

    @Test
    @DisplayName("Relatório por Categoria: Deve agrupar despesas corretamente")
    @WithMockUser(username = "user123")
    void shouldReturnExpensesByCategory() throws Exception {
        LocalDate today = LocalDate.now();
        // Duas despesas na mesma categoria 'Alimentação'
        createTransaction("EXPENSE", "50.00", "Almoço", "Alimentação", today);
        createTransaction("EXPENSE", "30.00", "Jantar", "Alimentação", today);
        // Uma despesa em 'Transporte'
        createTransaction("EXPENSE", "20.00", "Uber", "Transporte", today);

        String url = String.format("/transactions/categories?startDate=%s&endDate=%s", today, today);

        mockMvc.perform(get(url)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenses", hasSize(2)))
                // Verifica se 'Alimentação' somou 80.00
                .andExpect(jsonPath("$.expenses[?(@.category == 'Alimentação')].amount").value(80.0))
                .andExpect(jsonPath("$.expenses[?(@.category == 'Transporte')].amount").value(20.0));
    }

    @Test
    @DisplayName("Robustez: Deve retornar erro 400 se parâmetro de data estiver mal formatado na URL")
    @WithMockUser(username = "user123")
    void shouldReturnBadRequestForBadUrlParams() throws Exception {
        // Data enviada como DD-MM-AAAA (O Spring espera ISO: AAAA-MM-DD)
        mockMvc.perform(get("/transactions/overview?startDate=30-11-2025&endDate=2025-11-30")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()); // TypeMismatchException tratado pelo Spring
    }

    @Test
    @DisplayName("Sucesso: Deve atualizar uma transação existente")
    @WithMockUser(username = "user123")
    void shouldUpdateTransactionSuccessfully() throws Exception {
        // 1. Dado: Uma transação existente
        Transaction transaction = new Transaction();
        transaction.setUserId(testUser.getId());
        transaction.setType(TransactionType.EXPENSE);
        transaction.setAmount(new BigDecimal("100.00"));
        transaction.setDescription("Antigo");
        transaction.setCategory("Geral");
        transaction.setDate(LocalDate.now());
        transaction = transactionRepository.save(transaction);

        // 2. Quando: Enviamos uma atualização
        String updateJson = """
            {
                "type": "EXPENSE",
                "amount": 250.00,
                "description": "Atualizado",
                "category": "Alimentação",
                "date": "2025-12-01",
                "notes": "Nota atualizada"
            }
            """;

        mockMvc.perform(put("/transactions/{id}", transaction.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(250.0))
                .andExpect(jsonPath("$.description").value("Atualizado"));

        // 3. Então: O banco deve estar atualizado
        Transaction updatedInDb = transactionRepository.findById(transaction.getId()).orElseThrow();
        assertThat(updatedInDb.getAmount()).isEqualByComparingTo("250.00");
        assertThat(updatedInDb.getCategory()).isEqualTo("Alimentação");
    }

    @Test
    @DisplayName("Segurança: Não deve permitir alterar transação de OUTRO usuário (IDOR)")
    @WithMockUser(username = "hacker123") // Usuário diferente do dono (user123)
    void shouldDenyUpdateOnOthersTransaction() throws Exception {
        // 1. Dado: Transação do user123
        Transaction victimTransaction = new Transaction();
        victimTransaction.setUserId(testUser.getId());
        victimTransaction.setType(TransactionType.INCOME);
        victimTransaction.setAmount(new BigDecimal("5000.00"));
        victimTransaction.setDescription("Salário");
        victimTransaction.setCategory("Trabalho");
        victimTransaction.setDate(LocalDate.now());
        transactionRepository.save(victimTransaction);

        // 2. Quando: Hacker tenta alterar
        String maliciousUpdate = """
            {
                "type": "INCOME",
                "amount": 1.00,
                "description": "Hacked",
                "category": "Trabalho",
                "date": "2025-12-01"
            }
            """;

        mockMvc.perform(put("/transactions/{id}", victimTransaction.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(maliciousUpdate))
                .andExpect(status().isConflict()) // BusinessException (Unauthorized) -> 409
                .andExpect(jsonPath("$.message").value("Unauthorized"));

        // 3. Então: O valor original deve permanecer intacto
        Transaction safeTransaction = transactionRepository.findById(victimTransaction.getId()).orElseThrow();
        assertThat(safeTransaction.getAmount()).isEqualByComparingTo("5000.00");
    }

    // ==================================================================================
    // TESTES DE EXCLUSÃO (DELETE)
    // ==================================================================================

    @Test
    @DisplayName("Sucesso: Deve excluir transação própria")
    @WithMockUser(username = "user123")
    void shouldDeleteTransaction() throws Exception {
        Transaction t = new Transaction();
        t.setUserId(testUser.getId());
        t.setType(TransactionType.EXPENSE);
        t.setAmount(BigDecimal.TEN);
        t.setDescription("To Delete");
        t.setCategory("Geral");
        t.setDate(LocalDate.now());
        t = transactionRepository.save(t);

        mockMvc.perform(delete("/transactions/{id}", t.getId()))
                .andExpect(status().isNoContent()); // 204

        assertThat(transactionRepository.existsById(t.getId())).isFalse();
    }

    @Test
    @DisplayName("Segurança: Não deve permitir excluir transação de outro usuário")
    @WithMockUser(username = "hacker123")
    void shouldDenyDeleteOnOthersTransaction() throws Exception {
        Transaction t = new Transaction();
        t.setUserId(testUser.getId());
        t.setType(TransactionType.EXPENSE);
        t.setAmount(BigDecimal.TEN);
        t.setDescription("To Keep");
        t.setCategory("Geral");
        t.setDate(LocalDate.now());
        t = transactionRepository.save(t);

        mockMvc.perform(delete("/transactions/{id}", t.getId()))
                .andExpect(status().isConflict()); // BusinessException -> 409

        assertThat(transactionRepository.existsById(t.getId())).isTrue();
    }

    // ==================================================================================
    // TESTES DE LISTAGEM E FILTROS (GET)
    // ==================================================================================

    @Test
    @DisplayName("Filtro: Deve listar transações apenas dentro do período selecionado")
    @WithMockUser(username = "user123")
    void shouldFilterTransactionsByDate() throws Exception {
        // Passado (Fora)
        createTransaction("EXPENSE", "100.00", LocalDate.of(2025, 1, 1));
        // Presente (Dentro)
        createTransaction("EXPENSE", "50.00", LocalDate.of(2025, 6, 15));
        // Futuro (Fora)
        createTransaction("EXPENSE", "200.00", LocalDate.of(2025, 12, 31));

        // Filtro: Apenas Junho/2025
        mockMvc.perform(get("/transactions")
                        .param("startDate", "2025-06-01")
                        .param("endDate", "2025-06-30")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].amount").value(50.0));
    }

    @Test
    @DisplayName("Relatório Anual: Deve estruturar corretamente os meses")
    @WithMockUser(username = "user123")
    void shouldReturnYearlyReportStructure() throws Exception {
        // Cria uma transação em Março
        createTransaction("INCOME", "1000.00", LocalDate.of(2025, 3, 15));

        mockMvc.perform(get("/transactions/yearly")
                        .param("year", "2025")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reports", hasSize(12))) // Deve ter 12 meses
                // Janeiro (Index 0) deve estar vazio
                .andExpect(jsonPath("$.reports[0].month").value("Jan"))
                .andExpect(jsonPath("$.reports[0].receitas").value(0))
                // Março (Index 2) deve ter valor
                .andExpect(jsonPath("$.reports[2].month").value("Mar"))
                .andExpect(jsonPath("$.reports[2].receitas").value(1000.0));
    }

    @Test
    @DisplayName("Relatório: Deve retornar soma correta por tipo (Receita/Despesa)")
    @WithMockUser(username = "user123")
    void shouldReturnSumByType() throws Exception {
        // Cenário:
        // 1. Receita de 1000 (Hoje)
        // 2. Receita de 500 (Ontem)
        // 3. Despesa de 200 (Hoje) - Deve ser ignorada no filtro de INCOME
        LocalDate today = LocalDate.now();
        createTransaction("INCOME", "1000.00", today);
        createTransaction("INCOME", "500.00", today.minusDays(1));
        createTransaction("EXPENSE", "200.00", today);

        // Ação: Pedir soma de INCOME no período
        String url = String.format("/transactions/sum?type=INCOME&startDate=%s&endDate=%s",
                today.minusDays(5), today);

        mockMvc.perform(get(url)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1500.0)); // 1000 + 500
    }

    @Test
    @DisplayName("Relatório: Deve agrupar despesas diárias corretamente")
    @WithMockUser(username = "user123")
    void shouldReturnDailyExpenses() throws Exception {
        LocalDate today = LocalDate.now();
        // Duas despesas hoje
        createTransaction("EXPENSE", "10.00", "Café", "Alimentação", today);
        createTransaction("EXPENSE", "20.00", "Almoço", "Alimentação", today);
        // Uma despesa ontem
        createTransaction("EXPENSE", "100.00", "Gasolina", "Transporte", today.minusDays(1));

        String url = String.format("/transactions/daily?startDate=%s&endDate=%s",
                today.minusDays(1), today);

        mockMvc.perform(get(url)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenses", hasSize(2))) // Hoje e Ontem
                // Verifica o dia de hoje (deve somar 30.00)
                .andExpect(jsonPath("$.expenses[?(@.day == '" + today.getDayOfMonth() + "')].value").value(30.0));
    }

    @Test
    @DisplayName("Robustez: Relatórios devem retornar vazio (não erro) quando não há dados")
    @WithMockUser(username = "user123")
    void shouldReturnEmptyReports_WhenNoTransactions() throws Exception {
        LocalDate today = LocalDate.now();
        String params = String.format("?startDate=%s&endDate=%s", today, today);

        // 1. Overview Vazio
        mockMvc.perform(get("/transactions/overview" + params))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome").value(0))
                .andExpect(jsonPath("$.balance").value(0))
                .andExpect(jsonPath("$.recentTransactions", hasSize(0)));

        // 2. Categorias Vazio
        mockMvc.perform(get("/transactions/categories" + params))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenses", hasSize(0)));

        // 3. Diário Vazio
        mockMvc.perform(get("/transactions/daily" + params))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expenses", hasSize(0)));
    }

    @Test
    @DisplayName("Coverage: Deve retornar Overview com datas padrão (Mês atual) quando sem parâmetros")
    @WithMockUser(username = "user123")
    void shouldReturnOverviewWithDefaultDates() throws Exception {
        // Cenário: Transação HOJE (dentro do default) e transação 2 MESES ATRÁS (fora)
        LocalDate today = LocalDate.now();
        createTransaction("INCOME", "1000.00", today); // Deve somar
        createTransaction("INCOME", "5000.00", today.minusMonths(2)); // Deve ignorar

        // Ação: Chamar SEM query params (?startDate=...)
        // Isso força o backend a entrar no 'if (startDate == null)'
        mockMvc.perform(get("/transactions/overview")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Deve considerar apenas os 1000.00 do mês atual
                .andExpect(jsonPath("$.totalIncome").value(1000.0));
    }

    @Test
    @DisplayName("Coverage: Deve retornar Todas as Transações quando sem parâmetros de data")
    @WithMockUser(username = "user123")
    void shouldReturnAllTransactionsWithoutDateFilters() throws Exception {
        // Cenário: Transações em datas muito diferentes
        createTransaction("EXPENSE", "50.00", LocalDate.now());
        createTransaction("EXPENSE", "50.00", LocalDate.now().minusYears(1));

        // Ação: Chamar getAll sem datas
        // Isso testa o 'else' do ternário no controller: transactionService.getAllTransactions(userId)
        mockMvc.perform(get("/transactions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)));
    }

    @Test
    @DisplayName("Coverage: Overview deve calcular Taxa de Economia (SavingsRate) corretamente")
    @WithMockUser(username = "user123")
    void shouldCalculateSavingsRate() throws Exception {
        // Cenário: Ganhou 1000, Gastou 200. Sobrou 800.
        // Taxa de economia esperada: (800 / 1000) * 100 = 80%
        LocalDate today = LocalDate.now();
        createTransaction("INCOME", "1000.00", today);
        createTransaction("EXPENSE", "200.00", today);

        mockMvc.perform(get("/transactions/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.savingsRate").value(80.0));
    }

    @Test
    @DisplayName("Coverage: Overview deve tratar divisão por zero na Taxa de Economia")
    @WithMockUser(username = "user123")
    void shouldHandleZeroIncomeInSavingsRate() throws Exception {
        // Cenário: Gastou 100, mas não ganhou nada (Renda 0)
        // Evita ArithmeticException /NaN
        createTransaction("EXPENSE", "100.00", LocalDate.now());

        mockMvc.perform(get("/transactions/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.savingsRate").value(0));
    }

    // --- Helpers ---
    private void createTransaction(String type, String amount, LocalDate date) {
        createTransaction(type, amount, "Desc", "Geral", date);
    }

    private void createTransaction(String type, String amount, String desc, String category, LocalDate date) {
        Transaction t = new Transaction();
        t.setUserId(testUser.getId());
        t.setType(TransactionType.valueOf(type));
        t.setAmount(new BigDecimal(amount));
        t.setDescription(desc);
        t.setCategory(category);
        t.setDate(date);
        transactionRepository.save(t);
    }
}