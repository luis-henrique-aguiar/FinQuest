# 🦊 FinQuest - Educação Financeira Gamificada

<div align="center">

**Transforme sua relação com o dinheiro através da gamificação**

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

[Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias)  • [Arquitetura](#-arquitetura)

</div>

---

## 📖 Sobre o Projeto

**FinQuest** é uma plataforma inovadora de educação financeira que utiliza técnicas de gamificação para tornar o aprendizado sobre finanças pessoais mais engajador e eficaz para jovens adultos. Através de missões, conquistas, níveis e um sistema de pontos (FinPoints), os usuários aprendem conceitos financeiros enquanto se divertem.

### 🎯 Problema que Resolve

A falta de educação financeira entre jovens brasileiros leva a:
- Endividamento precoce
- Dificuldade em poupar e investir
- Desconhecimento sobre planejamento financeiro
- Baixa taxa de poupança nacional

### 💡 Nossa Solução

FinQuest combina:
- ✅ **Educação**: Cursos estruturados e lições interativas
- ✅ **Gamificação**: Missões, conquistas e sistema de níveis
- ✅ **Prática**: Simuladores e ferramentas de planejamento
- ✅ **Motivação**: Recompensas por progresso e aprendizado

---

## ✨ Funcionalidades

### 🎓 Sistema de Aprendizado

#### **Cursos e Lições Interativas**
- 📚 Trilhas de conhecimento estruturadas em cursos temáticos
- 📝 Lições de 5-10 minutos com conteúdo didático
- ❓ Quizzes interativos para fixação do aprendizado
- 🎯 Sistema de progresso visual (0-100%)
- 🏆 Certificados ao completar trilhas

#### **Tópicos Abordados**
- Orçamento pessoal e familiar
- Investimentos (Renda fixa, variável, fundos)
- Controle de dívidas e crédito
- Planejamento de metas financeiras
- Educação sobre juros compostos

### 🎮 Sistema de Gamificação

#### **FinPoints - Sistema de Pontos**
- 💰 Ganhe FinPoints completando lições, missões e metas
- 📈 Evolua de nível baseado nos seus pontos acumulados
- 🔢 Sistema de progressão exponencial (nível 1 → 100 XP, nível 2 → 130 XP...)

#### **Missões**
- 🎯 Missões diárias e semanais
- 📊 4 categorias: Aprendizado, Orçamento, Metas e Social
- 🎁 Recompensas em FinPoints
- 📈 Acompanhamento de progresso (ex: "Complete 3 lições - 2/3")

#### **Conquistas e Badges**
- 🏅 Desbloqueie badges ao atingir níveis específicos
- 🎖️ Conquistas especiais por marcos importantes
- 👤 Perfil personalizado com avatar e emblemas

### 💰 Ferramentas Financeiras

#### **Acompanhamento Financeiro**
- 📊 Registre receitas e despesas
- 🏷️ Categorização automática
- 📈 Gráficos de distribuição de gastos
- 💵 Cálculo de saldo e taxa de poupança
- 📅 Filtros por período (mês, ano)

**Categorias Disponíveis:**
- **Receitas**: Salário, Freelance, Investimentos, Vendas, Presente, Outros Ganhos
- **Despesas**: Alimentação, Moradia, Transporte, Saúde, Educação, Entretenimento, Roupas, Serviços, Outros Gastos

#### **Planejamento Orçamentário**
- 📅 Crie orçamentos mensais
- 💡 Sugestões baseadas no histórico
- 🎯 Compare planejado vs. realizado
- 📊 Visualização de aderência ao orçamento

#### **Metas Financeiras**
- 🎯 Crie metas personalizadas (ex: "Comprar PS5 - R$ 4.500")
- 📈 Acompanhe progresso em tempo real
- 💰 Registre depósitos incrementais
- 🏆 Ganhe recompensas ao atingir 25%, 50%, 75% e 100%
- ✅ Status automático (Em Progresso, Concluída, Cancelada)

#### **Simulador de Investimentos**
- 📊 Simule diferentes estratégias de investimento
- ⏱️ Visualize efeito dos juros compostos
- 💹 Compare cenários (conservador vs. arrojado)
- 📈 Gráficos interativos de evolução patrimonial

### 👨‍💼 Painel Administrativo

- 📊 Dashboard com estatísticas da plataforma
- 👥 Gerenciamento de usuários
- 📈 Métricas de engajamento
- 🎯 Acompanhamento de missões completadas
- 🏆 Estatísticas de níveis e conquistas

---

## 🛠 Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Java** | 21 | Linguagem de programação principal |
| **Spring Boot** | 3.5.6 | Framework para aplicações Java |
| **Spring Security** | 3.x | Autenticação e autorização |
| **Spring Data JPA** | 3.x | Persistência de dados |
| **Hibernate** | 6.x | ORM (Object-Relational Mapping) |
| **MySQL** | 8.0+ | Banco de dados relacional |
| **Firebase Admin SDK** | 9.7.0 | Autenticação via Firebase |
| **Maven** | 3.9+ | Gerenciador de dependências |
| **Docker** | - | Containerização |

## 🏗 Arquitetura

### Visão Geral

```mermaid
graph TD
    %% --- Definição de Estilos (Classes) ---
    %% Cores mais fortes para contraste no Dark Mode e texto branco forçado
    classDef actor fill:#E91E63,stroke:#F48FB1,stroke-width:2px,color:#fff;
    classDef frontend fill:#1565C0,stroke:#90CAF9,stroke-width:2px,color:#fff;
    classDef external fill:#F57C00,stroke:#FFCC80,stroke-width:2px,color:#fff;
    classDef backend fill:#2E7D32,stroke:#A5D6A7,stroke-width:2px,color:#fff;
    classDef security fill:#C62828,stroke:#EF9A9A,stroke-width:2px,color:#fff;
    classDef db fill:#455A64,stroke:#B0BEC5,stroke-width:2px,color:#fff;
    classDef default color:#fff;

    %% Atores
    User((Usuário Final)):::actor

    %% Subgraph: Frontend
    subgraph Frontend_System [Frontend Application]
        direction TB
        UI[Interface React/Web]:::frontend
        AuthHandler["Auth Handler / Firebase SDK"]:::frontend
        APIClient["HTTP Client / Axios"]:::frontend
    end
    style Frontend_System fill:#0D47A1,stroke:#90CAF9,color:#fff,fill-opacity:0.3

    %% Subgraph: Serviços Externos
    subgraph External_Services [Infraestrutura Externa]
        FirebaseAuth[Firebase Authentication]:::external
    end
    style External_Services fill:#E65100,stroke:#FFCC80,color:#fff,fill-opacity:0.3

    %% Subgraph: Backend
    subgraph Backend_System [Backend - Spring Boot API]
        direction TB
        
        %% Camada de Segurança
        SecurityFilter["Security FilterChain<br/>(JWT Validation)"]:::security

        %% Camada de Apresentação
        Controllers["REST Controllers<br/>(User, Transaction, Goal, etc.)"]:::backend
        
        %% Camada de Negócio
        subgraph Domain_Layer [Domain & Services]
            BusinessServices["Services<br/>(TransactionService, GamificationService)"]:::backend
            Entities[JPA Entities]:::backend
        end
        style Domain_Layer fill:#1B5E20,stroke:#A5D6A7,color:#fff,fill-opacity:0.2
        
        %% Camada de Acesso a Dados
        Repositories[JPA Repositories]:::backend
    end
    style Backend_System fill:#1B5E20,stroke:#A5D6A7,color:#fff,fill-opacity:0.3

    %% Subgraph: Banco de Dados
    subgraph Persistence [Persistência]
        MySQL[(MySQL Database)]:::db
    end
    style Persistence fill:#263238,stroke:#B0BEC5,color:#fff,fill-opacity:0.3

    %% ================= RELACIONAMENTOS =================

    %% 1. Interação do Usuário
    User -->|"1. Interage / Login"| UI

    %% 2. Fluxo de Autenticação
    UI -->|"2. Solicita Login"| AuthHandler
    AuthHandler -->|"3. Envia Credenciais"| FirebaseAuth
    FirebaseAuth -->|"4. Retorna ID Token (JWT)"| AuthHandler
    AuthHandler -->|"5. Armazena Token"| APIClient

    %% 3. Fluxo de Requisição de Dados
    UI -->|"6. Ação (ex: Criar Despesa)"| APIClient
    APIClient -->|"7. HTTPS Request + Bearer Token"| SecurityFilter

    %% 4. Validação no Backend
    SecurityFilter -.->|"8. Valida Assinatura/Token"| FirebaseAuth
    SecurityFilter -->|"9. Token Válido (UserDetails)"| Controllers

    %% 5. Processamento Interno
    Controllers -->|"10. DTOs"| BusinessServices
    BusinessServices -->|"11. Regras de Negócio + Gamificação"| Repositories

    %% 6. Persistência
    Repositories -->|"12. SQL Queries"| MySQL
    MySQL -->|"13. Result Set"| Repositories
```

### Padrões de Projeto Utilizados

#### 🎯 **MVC (Model-View-Controller)**
Arquitetura padrão do Spring Boot separando responsabilidades

#### 🔄 **Repository Pattern**
Abstração de acesso a dados com Spring Data JPA

#### 🎨 **DTO Pattern (Data Transfer Objects)**
Transferência de dados entre camadas usando Java Records
```java
public record TransactionDTO(
    String id,
    String type,
    BigDecimal amount,
    String description,
    String category,
    String date,
    String notes
) {}
```

#### 🔒 **Dependency Injection**
Injeção de dependências gerenciada pelo Spring

#### 🏭 **Service Layer Pattern**
Camada intermediária entre controllers e repositories

---

## 📦 Recursos e Documentos

Abaixo estão os materiais complementares para avaliação do projeto:

[![Documentação API](https://img.shields.io/badge/Documentação_API-PDF-EC1C24?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](./docs/Documentacao_Tecnica_API_FinQuest.pdf)
[![Assista ao Vídeo](https://img.shields.io/badge/Assista_ao_Vídeo-Google_Drive-4285F4?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1eiGSFRzTIaQocQIsbClvT7hl1HeUs4Lx/view?usp=sharing)

---

## 👥 Equipe

| Nome Completo | Prontuário |
| :--- | :---: |
| **Luis Henrique Aguiar** | AQ302234X |
| **Cristiano Rodrigues de Oliveira** | AQ3022641 |
| **Érika Santana Alves** | AQ3022722 |
| **Matheus Mantovani** | AQ3022927 |
| **João Andolpho** | AQ3022501 |
---

<div align="center"> <sub>FinQuest © 2025 - Educação Financeira para Todos</sub> </div>
