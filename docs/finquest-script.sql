-- ============================================================================
-- SCRIPT UNIFICADO FINQUEST (DADOS COMPLETOS)
-- ============================================================================

-- 1. CONFIGURAÇÕES INICIAIS
SET FOREIGN_KEY_CHECKS = 0;

-- (Opcional) Limpeza para garantir que não haja duplicatas antigas ou IDs conflitantes
TRUNCATE TABLE alternatives;
TRUNCATE TABLE questions;
TRUNCATE TABLE user_lesson_completion;
TRUNCATE TABLE user_mission_progress;
TRUNCATE TABLE user_enrollment;
TRUNCATE TABLE user_achievement;
TRUNCATE TABLE missions;
TRUNCATE TABLE achievement;
TRUNCATE TABLE lessons;
TRUNCATE TABLE courses;
TRUNCATE TABLE users;

-- ============================================================================
-- 2. USUÁRIOS
-- ============================================================================
INSERT IGNORE INTO users (id, name, email, total_fin_points, avatar_url, level, registration_at)
VALUES
('DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'Admin', 'admin@finquest.com', 0, null, 1, NOW());

-- ============================================================================
-- 3. CURSOS
-- ============================================================================
INSERT IGNORE INTO courses (id, title, description, icon, rec_fin_points)
VALUES
('M0', 'A Verdade Sobre Seu Dinheiro', 'Aprenda com casos reais como a educação financeira pode ser benéfica', '🦊', 100),
('M1', 'A Psicologia do Dinheiro', 'Entenda como suas emoções impactam suas decisões financeiras.', '🧠', 100),
('M2', 'Primeiros Passos no Mundo das Finanças', 'Aprenda o básico para começar a investir.', '✨', 100),
('M3', 'Aprenda a Investir', 'Siga dicas e estratégias para colocar a mão na massa!', '📊', 150),
('M4', 'Passos Avançados', 'Aprenda os conteúdos mais avançados das finanças e se torne um investidor de sucesso.', '🚀', 120);

-- 3. INSERÇÃO DAS LIÇÕES (Lista Consolidada e Mapeada)
INSERT IGNORE INTO lessons (id, course_id, title, rec_fin_points, lesson_order, content_url, is_draft, last_modified)
VALUES
-- M0: Introdução
('M0-L1', 'M0', ' A História de Alex (E a Sua Também)', 20, 1, 'lessons/M0-L1.md', false, NOW()),
('M0-L2', 'M0', '"Não Sei Para Onde Meu Dinheiro Vai..."', 30, 2, 'lessons/M0-L2.md', false, NOW()),
('M0-L3', 'M0', 'Os 3 Pilares da Educação Financeira', 50, 3, 'lessons/M0-L3.md', false, NOW()),
('M0-L4', 'M0', 'Como o FinQuest Vai Te Ajudar', 20, 4, 'lessons/M0-L4.md', false, NOW()),

-- M1: A Psicologia do Dinheiro (Mapeamento de Q4 a Q18)
('M1-L1', 'M1', 'A Disciplina: O Motor da Educação Financeira', 20, 1, 'lessons/M1-L1.md', false, NOW()),
('M1-L2', 'M1', 'Proteja Seu Dinheiro: A Armadilha do "Dinheiro Fácil"', 30, 2, 'lessons/M1-L2.md', false, NOW()),
('M1-L3', 'M1', 'O Plano de Virada: Como Sair das Dívidas e Fortalecer sua Mente', 50, 3, 'lessons/M1-L3.md', false, NOW()),
('M1-L4', 'M1', 'As Armadilhas do Consumo: Por Que Compramos o Que Não Precisamos?', 20, 4, 'lessons/M1-L4.md', false, NOW()),

-- M2: Primeiros Passos (Mapeamento de Q19 a Q42)
('M2-L1', 'M2', 'A Importância da Educação Financeira na Sua Vida', 20, 1, 'lessons/M2-L1.md', false, NOW()),
('M2-L2', 'M2', 'Como a Economia Brasileira Funciona: O Jogo do Dinheiro', 30, 2, 'lessons/M2-L2.md', false, NOW()),
('M2-L3', 'M2', 'O que é a reserva de emergência e qual a sua importância?', 50, 3, 'lessons/M2-L3.md', false, NOW()),
('M2-L4', 'M2', 'A Inflação: O Inimigo Invisível do Seu Poder de Compra', 20, 4, 'lessons/M2-L4.md', false, NOW()),
('M2-L5', 'M2', 'A Taxa Selic: O Volante da Economia Brasileira', 20, 5, 'lessons/M2-L5.md', false, NOW()),
('M2-L6', 'M2', 'Dívidas e Crédito: Ferramentas de Doble Fio', 30, 6, 'lessons/M2-L6.md', false, NOW()),
('M2-L7', 'M2', 'O Poder dos Juros Compostos', 50, 7, 'lessons/M2-L7.md', false, NOW()),
('M2-L8', 'M2', 'A Bolsa de Valores: Tornando-se Sócio de Grandes Empresas', 20, 8, 'lessons/M2-L8.md', false, NOW()),
('M2-L9', 'M2', 'Quem Manda no Jogo? A Importância dos Órgãos Financeiros', 20, 9, 'lessons/M2-L9.md', false, NOW()),

-- M3: Aprenda a Investir (Mapeamento de Q43 a Q71)
('M3-L1', 'M3', 'Entendendo sobre Investimentos', 20, 1, 'lessons/M3-L1.md', false, NOW()),
('M3-L2', 'M3', 'Batalha dos Iniciantes: Poupança vs. Tesouro Selic', 30, 2, 'lessons/M3-L2.md', false, NOW()),
('M3-L3', 'M3', 'O Cinto de Segurança do Investidor: Entendendo o FGC', 50, 3, 'lessons/M3-L3.md', false, NOW()),
('M3-L4', 'M3', 'Renda Extra: O Acelerador da Sua Riqueza', 20, 4, 'lessons/M3-L4.md', false, NOW()),
('M3-L5', 'M3', 'Identificando o seu perfil investidor', 20, 5, 'lessons/M3-L5.md', false, NOW()),
('M3-L6', 'M3', 'O Seu Primeiro Salário: O Ponto de Partida da Sua Independência', 30, 6, 'lessons/M3-L6.md', false, NOW()),
('M3-L7', 'M3', 'LCI e LCA: O "Bônus" da Renda Fixa', 50, 7, 'lessons/M3-L7.md', false, NOW()),

-- M4: Passos Avançados (Mapeamento de Q72 a Q97)
('M4-L1', 'M4', 'Fundos de Investimento: Delegando a Gestão', 20, 1, 'lessons/M4-L1.md', false, NOW()),
('M4-L2', 'M4', 'Diversificando sua Carteira: O "Almoço Grátis" do Mercado', 30, 2, 'lessons/M4-L2.md', false, NOW()),
('M4-L3', 'M4', 'O "Cisne Negro": O que Fazer Quando Suas Ações Despencam?', 50, 3, 'lessons/M4-L3.md', false, NOW()),
('M4-L4', 'M4', 'Investindo no Exterior: A Diversificação Definitiva', 20, 4, 'lessons/M4-L4.md', false, NOW()),
('M4-L5', 'M4', 'Criptomoedas: O "Velho Oeste" de Alto Risco e Alta Tecnologia', 20, 5, 'lessons/M4-L5.md', false, NOW()),
('M4-L6', 'M4', 'A Aposentadoria: O "Fim do Jogo" da Riqueza', 30, 6, 'lessons/M4-L6.md', false, NOW());

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 1
(1, 'M0-L1', 'Apesar de ter um salário de R$ 2.500, Alex terminou o mês no vermelho. Qual foi o principal motivo identificado na história?', 1, 
'O texto deixa claro que o problema não foi o valor do salário, mas a falta de planejamento prévio (Erro #1) e o desconhecimento sobre como gerenciar o dinheiro.'),

-- Questão 2
(2, 'M0-L1', 'Na história, o que são os "gastos invisíveis" (ou "gastos formiga") que consumiram R$ 1.080 do orçamento de Alex?', 2, 
'Gastos formiga são pequenas despesas frequentes (café, lanche, transporte, apps) que parecem baratas e inofensivas individualmente,
 mas somam um valor muito alto no final do mês.'),

-- Questão 3
(3, 'M0-L1', 'Alex parcelou um videogame em 10x de R$ 200. Por que o texto considera o pensamento "é só uma parcela pequena"
 uma armadilha perigosa?', 3, 'O texto explica que parcelas pequenas se acumulam e comprometem a renda futura. No caso de Alex, 
 somando com outras parcelas, 21% do salário dele já estava "preso" antes mesmo de receber.'),

-- Questão 4
(4, 'M0-L1', 'Segundo a lição aprendida por Alex, qual é a verdadeira definição de Educação Financeira?', 4, 'A lição enfatiza 
que educação financeira não é mágica para ficar rico rápido, nem apenas sobre ganhar mais, mas sim sobre ter a habilidade de gerenciar
 e fazer o dinheiro que você já tem trabalhar a seu favor.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 1 (IDs 1-4)
(1, 1, 'O salário dele era muito baixo para cobrir apenas os gastos básicos de aluguel e comida.', 0),
(2, 1, 'Ele sofreu um roubo em sua conta bancária logo após receber.', 0),
(3, 1, 'Ele gastou por impulso sem listar suas contas fixas antes.', 1),
(4, 1, 'A inflação aumentou os preços de tudo na mesma semana que ele recebeu.', 0),

-- Alternativas da Questão 2 (IDs 5-8)
(5, 2, 'São as contas fixas mensais como aluguel, luz e água.', 0),
(6, 2, 'São pequenas despesas frequentes que, somadas, viram um valor alto.', 1),
(7, 2, 'São compras grandes de alto valor, como um videogame ou tênis de marca.', 0),
(8, 2, 'São impostos governamentais descontados diretamente da folha de pagamento.', 0),

-- Alternativas da Questão 3 (IDs 9-12)
(9, 3, 'Porque o videogame provavelmente quebraria antes de ele terminar de pagar.', 0),
(10, 3, 'Porque parcelas acumuladas comprometem uma grande parte da renda futura.', 1),
(11, 3, 'Porque pagar à vista é a única forma aceitável de comprar qualquer coisa.', 0),
(12, 3, 'Porque o valor da parcela aumenta a cada mês devido aos juros abusivos.', 0),

-- Alternativas da Questão 4 (IDs 13-16)
(13, 4, 'Saber como ganhar o triplo do salário em um único mês.', 0),
(14, 4, 'Cortar absolutamente todos os gastos de lazer para sempre.', 0),
(15, 4, 'Fazer o dinheiro que você já tem trabalhar a seu favor.', 1),
(16, 4, 'Aprender a investir na bolsa de valores sem ter reserva de emergência.', 0);


-- M0-L2

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 5
(5, 'M0-L2', 'No contexto da lição, o que define os chamados "Gastos Formiga"?', 1, 'O texto define Gastos Formiga como
 pequenas despesas do dia a dia (café, lanches, apps) que, isoladamente, parecem inofensivas, mas somadas ao final do mês representam uma quantia enorme.'),

-- Questão 6
(6, 'M0-L2', 'Alex fez um cálculo sobre o seu consumo diário de café de R$ 5,00. Qual foi a conclusão chocante que ele 
teve ao projetar esse gasto para um ano?', 2, 'O cálculo mostrou: R$ 5 x 22 dias = R$ 110/mês. Em um ano, isso soma R$ 1.320. 
A conclusão de Alex foi que esse valor seria suficiente para comprar um notebook novo, algo muito mais relevante que os cafés.'),

-- Questão 7
(7, 'M0-L2', 'Qual é a regra principal do "Método dos 30 Dias" ensinado a Alex para retomar o 
controle financeiro?', 3, 'A regra de ouro descrita é: Anote CADA gasto no momento em que acontece, 
sem julgar ou tentar cortar nada inicialmente. O objetivo é apenas observar e criar consciência dos padrões.'),

-- Questão 8
(8, 'M0-L2', 'Ao analisar seus gastos com delivery, Alex percebeu uma conexão importante entre seu 
dinheiro e suas emoções. Qual foi essa descoberta?', 4, 'Alex descobriu que gastava com delivery não apenas por fome,
 mas por gatilhos emocionais: ansiedade na segunda-feira, cansaço na sexta e tristeza no domingo à noite.');
 
 INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 5 (IDs 17-20)
(17, 5, 'São gastos exclusivos com produtos de limpeza para dedetização da casa.', 0),
(18, 5, 'São grandes despesas mensais, como o aluguel e a parcela do carro.', 0),
(19, 5, 'São pequenas despesas frequentes que, somadas, destroem o orçamento silenciosamente.', 1),
(20, 5, 'São taxas bancárias cobradas apenas de contas inativas.', 0),

-- Alternativas da Questão 6 (IDs 21-24)
(21, 6, 'Que o café estava barato e ele deveria comprar dois por dia.', 0),
(22, 6, 'Que o gasto anual de R$ 1.320 equivalia ao preço de um notebook novo.', 1),
(23, 6, 'Que ele gastava mais em café do que pagava de aluguel.', 0),
(24, 6, 'Que o café era essencial para sua produtividade e não deveria ser contabilizado.', 0),

-- Alternativas da Questão 7 (IDs 25-28)
(25, 7, 'Cortar imediatamente todos os gastos supérfluos no primeiro dia.', 0),
(26, 7, 'Usar apenas dinheiro vivo e aposentar o cartão de crédito para sempre.', 0),
(27, 7, 'Anotar todos os gastos no momento da compra, sem julgamentos, para identificar padrões.', 1),
(28, 7, 'Esperar o fim do mês para tentar lembrar de cabeça onde gastou o dinheiro.', 0),

-- Alternativas da Questão 8 (IDs 29-32)
(29, 8, 'Ele percebeu que seus gastos eram motivados por sentimentos como ansiedade, cansaço e tédio.', 1),
(30, 8, 'Ele descobriu que a comida dos aplicativos era mais barata que cozinhar em casa.', 0),
(31, 8, 'Ele notou que só pedia delivery quando recebia visitas de amigos.', 0),
(32, 8, 'Ele percebeu que gastava muito porque os preços dos restaurantes aumentaram subitamente.', 0);


-- M0-L3

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 9
(9, 'M0-L3', 'Segundo a explicação de Ricardo, qual é a verdadeira definição de educação 
financeira baseada nos 3 Pilares?', 1, 'Ricardo explica que educação financeira não é apenas sobre ganhar mais dinheiro, mas sim sobre gerenciar os três pilares (Ganhar, Gastar e Guardar) para fazer o dinheiro que você já tem trabalhar a seu favor.'),

-- Questão 10
(10, 'M0-L3', 'O que diz a "Regra de Ouro" (Pague-se Primeiro) em relação ao momento 
certo de separar o dinheiro para investimentos?', 2, 'A regra ensina que você deve separar o dinheiro dos investimentos (10-20%) imediatamente assim que o salário cai na conta, antes de começar a pagar as contas ou gastar com lazer, adaptando sua vida ao valor restante.'),

-- Questão 11
(11, 'M0-L3', 'Dentro do pilar "Gastar", como o texto classifica despesas como "Streamings" 
e "Delivery" em comparação com "Aluguel" e "Mercado"?', 3, 'O texto classifica Aluguel e Mercado como "Gastos Essenciais" (necessários para sobrevivência),
 enquanto Streamings e Delivery são "Gastos Supérfluos" (luxos que podem ser cortados ou reduzidos se necessário).'),

-- Questão 12
(12, 'M0-L3', 'De acordo com a "Lei #4" apresentada na lição, qual deve ser a prioridade
 absoluta antes de começar a fazer investimentos de risco?', 4, 'A lição enfatiza que a segurança vem primeiro.
 Antes de buscar rentabilidade em investimentos de risco, é fundamental ter uma Reserva de Emergência (3 a 6 meses de despesas) guardada.');


INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 9 (IDs 33-36)
(33, 9, 'É a habilidade de conseguir o máximo de cartões de crédito com limites altos.', 0),
(34, 9, 'É sobre fazer o dinheiro que você já tem trabalhar a seu favor, equilibrando Ganhar, Gastar e Guardar.', 1),
(35, 9, 'Significa cortar absolutamente todos os gastos de lazer para viver apenas para o trabalho.', 0),
(36, 9, 'É a técnica de investir todo o salário na bolsa de valores e viver de empréstimos.', 0),

-- Alternativas da Questão 10 (IDs 37-40)
(37, 10, 'Você deve transferir 10-20% para investimentos assim que receber o salário, antes de gastar.', 1),
(38, 10, 'Você deve pagar todas as contas primeiro e investir apenas se sobrar dinheiro no fim do mês.', 0),
(39, 10, 'Você deve investir apenas quando tiver uma quantia grande, como R$ 10.000 acumulados.', 0),
(40, 10, 'Você deve gastar tudo o que ganha para fazer a economia girar e esperar um aumento.', 0),

-- Alternativas da Questão 11 (IDs 41-44)
(41, 11, 'Ambos são considerados gastos essenciais, pois lazer é tão importante quanto moradia.', 0),
(42, 11, 'Aluguel e Mercado são essenciais; Streamings e Delivery são supérfluos.', 1),
(43, 11, 'Delivery é um gasto essencial porque economiza tempo de cozinhar.', 0),
(44, 11, 'Aluguel é um gasto supérfluo porque você poderia morar com os pais para sempre.', 0),

-- Alternativas da Questão 12 (IDs 45-48)
(45, 12, 'Comprar um carro novo para evitar gastos com manutenção futura.', 0),
(46, 12, 'Pagar um churrasco para os amigos para celebrar o novo emprego.', 0),
(47, 12, 'Construir uma Reserva de Emergência equivalente a 3 a 6 meses de despesas.', 1),
(48, 12, 'Investir em criptomoedas voláteis para tentar dobrar o capital rapidamente.', 0);

-- M0-L4

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 13
(13, 'M0-L4', 'Após entender a teoria dos 3 Pilares, Alex se deparou com um novo obstáculo prático. Qual foi o problema identificado?', 1, 'Alex sabia "o que" fazer (teoria), mas não sabia "como" manter a disciplina e a constância no dia a dia, pois os métodos tradicionais (planilhas) eram chatos e desmotivadores.'),

-- Questão 14
(14, 'M0-L4', 'Segundo Ricardo, qual é o principal diferencial do FinQuest para resolver o problema de a educação financeira ser "chata e maçante"?', 2, 'O FinQuest utiliza a Gamificação, transformando o aprendizado em uma aventura com narrativas, níveis, missões e recompensas, tornando o processo divertido e viciante.'),

-- Questão 15
(15, 'M0-L4', 'O texto explica como o app usa o "Loop de Hábito" da psicologia comportamental. Qual é a sequência correta desse ciclo dentro do FinQuest?', 3, 'O ciclo descrito é: Gatilho (receber notificação) → Rotina (anotar o gasto no app) → Recompensa (ganhar FinPoints e ver progresso), o que cria o reforço positivo.'),

-- Questão 16
(16, 'M0-L4', 'Por que o sistema de "Metas Personalizadas" com barras de progresso visuais é considerado mais eficaz para manter a motivação?',
 4, 'A visualização do progresso (ex: ver uma barra em 82%) ativa o "Princípio do Progresso" e libera dopamina. Ver o sonho se aproximando visualmente é mais 
 motivador do que apenas ver números frios em uma conta.');


INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 13 (IDs 49-52)
(49, 13, 'Ele descobriu que precisava de muito dinheiro para começar a usar qualquer aplicativo.', 0),
(50, 13, 'Ele sabia o que fazer, mas não sabia como manter a disciplina e a motivação diária.', 1),
(51, 13, 'Ele não tinha um computador potente para rodar as planilhas complexas de finanças.', 0),
(52, 13, 'Ele achou que controlar gastos era inútil, pois a inflação corroeria tudo.', 0),

-- Alternativas da Questão 14 (IDs 53-56)
(53, 14, 'A Gamificação, que usa elementos de jogos como níveis e conquistas para engajar.', 1),
(54, 14, 'A contratação de contadores pessoais que ligam para cobrar o usuário todo dia.', 0),
(55, 14, 'O uso de inteligência artificial que bloqueia o cartão de crédito automaticamente.', 0),
(56, 14, 'A obrigatoriedade de assistir aulas de 3 horas de duração sem pular.', 0),

-- Alternativas da Questão 15 (IDs 57-60)
(57, 15, 'Gatilho (fome) → Rotina (pedir delivery) → Recompensa (gastar dinheiro).', 0),
(58, 15, 'Rotina (estudar) → Castigo (perder pontos) → Aprendizado (medo de errar).', 0),
(59, 15, 'Gatilho (notificação) → Rotina (anotar gasto) → Recompensa (ganhar pontos).', 1),
(60, 15, 'Recompensa (dinheiro) → Gatilho (compra por impulso) → Rotina (dívida).', 0),

-- Alternativas da Questão 16 (IDs 61-64)
(61, 16, 'Porque o app garante que o dinheiro investido vai render 100% ao mês.', 0),
(62, 16, 'Porque visualização e feedback imediato geram dopamina e motivação para continuar.', 1),
(63, 16, 'Porque as metas impedem o usuário de sacar o dinheiro até atingir o objetivo.', 0),
(64, 16, 'Porque é a única forma de o banco liberar crédito para financiamentos.', 0);

-- M1-L1

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 17
(17, 'M1-L1', 'O texto faz uma distinção importante sobre o conceito de disciplina financeira. Segundo a lição, o que NÃO define disciplina?', 1, 'A lição enfatiza que disciplina NÃO é sinônimo de sofrimento ou de se privar de tudo o que gosta. Pelo contrário, é sobre fazer escolhas conscientes para realizar objetivos maiores.'),

-- Questão 18
(18, 'M1-L1', 'O hábito de "Pagar-se Primeiro" inverte a lógica tradicional que a maioria das pessoas usa. Como funciona essa inversão?', 2, 'A maioria das pessoas gasta e investe o que sobra. O investidor disciplinado separa o valor do investimento IMEDIATAMENTE ao receber o salário, antes de qualquer outro gasto, e vive com o restante.'),

-- Questão 19
(19, 'M1-L1', 'Qual é o principal argumento do texto para defender a "Automatização" dos investimentos (transferências automáticas)?', 3, 'O texto argumenta que a automatização serve para tirar a emoção e a necessidade de força de vontade da jogada. Ao automatizar, você garante que o investimento aconteça sem depender da sua memória ou disciplina no momento.'),

-- Questão 20
(20, 'M1-L1', 'No encerramento da lição, é feita uma analogia entre Conhecimento e Disciplina. Qual é a relação correta entre os dois?', 4, 'A analogia diz que o Conhecimento é o mapa (mostra o caminho/o que fazer), enquanto a Disciplina é o
 combustível (o que te move/faz você executar o plano até o destino).');
 
 INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 17 (IDs 65-68)
(65, 17, 'Disciplina é cortar absolutamente todos os gastos de lazer para sempre.', 0),
(66, 17, 'Disciplina não é sofrimento, mas sim a capacidade de fazer escolhas conscientes.', 1),
(67, 17, 'Disciplina é um dom natural; ou você nasce com ela ou nunca terá.', 0),
(68, 17, 'Disciplina é saber ganhar mais dinheiro do que se gasta, sem importar como.', 0),

-- Alternativas da Questão 18 (IDs 69-72)
(69, 18, 'Pagar todas as contas, gastar com lazer e investir apenas se sobrar dinheiro.', 0),
(70, 18, 'Investir o aporte mensal assim que o salário cai, antes de pagar contas ou gastar.', 1),
(71, 18, 'Usar o cartão de crédito para pagar investimentos e ganhar milhas.', 0),
(72, 18, 'Pedir adiantamento salarial para investir antes de receber o salário oficial.', 0),

-- Alternativas da Questão 19 (IDs 73-76)
(73, 19, 'Porque os sistemas bancários dão descontos para quem usa débito automático.', 0),
(74, 19, 'Para evitar que o dinheiro seja roubado da conta corrente por hackers.', 0),
(75, 19, 'Para não depender da força de vontade e tirar a emoção da decisão de investir.', 1),
(76, 19, 'Porque é a única forma permitida por lei de enviar dinheiro para corretoras.', 0),

-- Alternativas da Questão 20 (IDs 77-80)
(77, 20, 'O Conhecimento é o combustível e a Disciplina é o freio.', 0),
(78, 20, 'O Conhecimento é o mapa e a Disciplina é o combustível.', 1),
(79, 20, 'Ambos são o mapa, mas a Sorte é o combustível.', 0),
(80, 20, 'A Disciplina é inútil se você já tem muito Conhecimento.', 0);

-- M1-L2

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 21
(21, 'M1-L2', 'Segundo a lição, por que golpes financeiros funcionam tão bem do ponto de vista da neurociência?', 1, 'O texto explica que golpes são desenhados para "desligar" o Córtex Pré-Frontal (responsável pela lógica e planejamento) e ativar o Sistema Límbico (responsável pelas emoções, ganância e medo).'),

-- Questão 22
(22, 'M1-L2', 'Qual é a realidade matemática sobre apostas online e jogos de azar apresentada no texto?', 2, 'A lição afirma que apostas não são investimentos, mas entretenimento pago. Matematicamente, elas são desenhadas para a "casa" ganhar no longo prazo, e a estatística joga contra o apostador.'),

-- Questão 23
(23, 'M1-L2', 'Entre as "Bandeiras Vermelhas" citadas, qual é o sinal número 1 para identificar um golpe financeiro?', 3, 'O sinal mais forte é a promessa de rentabilidade alta, rápida e garantida. O texto reforça que, no mundo real, retorno alto exige risco alto. Retorno garantido (sem risco) só existe com rentabilidade baixa.'),

-- Questão 24
(24, 'M1-L2', 'Além do prejuízo financeiro, o texto destaca o "Trauma Financeiro" como uma consequência grave. O que ele causa na vítima?', 4, 'O trauma financeiro faz com que a vítima fique com tanto medo de ser enganada novamente que desiste de investir para sempre, rejeitando até mesmo opções seguras e regulamentadas como o Tesouro Direto.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 21 (IDs 81-84)
(81, 21, 'Porque eles usam cálculos matemáticos complexos que convencem o lado lógico do cérebro.', 0),
(82, 21, 'Porque eles ativam o Sistema Límbico (emoção) e desligam o Córtex Pré-Frontal (lógica).', 1),
(83, 21, 'Porque as vítimas geralmente possuem pouco conhecimento de matemática básica.', 0),
(84, 21, 'Porque os golpistas usam hipnose durante os vídeos de apresentação.', 0),

-- Alternativas da Questão 22 (IDs 85-88)
(85, 22, 'São uma forma válida de renda extra se você tiver sorte.', 0),
(86, 22, 'São investimentos de alto risco regulamentados pelo Banco Central.', 0),
(87, 22, 'São matematicamente desenhadas para a "casa" ganhar; é entretenimento, não investimento.', 1),
(88, 22, 'São mais seguros que a Bolsa de Valores porque o retorno é imediato.', 0),

-- Alternativas da Questão 23 (IDs 89-92)
(89, 23, 'A exigência de muitos documentos para abrir a conta.', 0),
(90, 23, 'A promessa de rentabilidade alta, rápida e garantida.', 1),
(91, 23, 'O oferecimento de cursos educativos junto com o investimento.', 0),
(92, 23, 'A cobrança de imposto de renda sobre o lucro.', 0),

-- Alternativas da Questão 24 (IDs 93-96)
(93, 24, 'Faz a pessoa pegar empréstimos para tentar recuperar o dinheiro perdido no mesmo golpe.', 0),
(94, 24, 'Faz a pessoa ter medo de investir para sempre, evitando até opções seguras.', 1),
(95, 24, 'Faz a pessoa estudar muito mais para tentar virar um golpista também.', 0),
(96, 24, 'Faz a pessoa processar o banco, mas não causa impacto psicológico.', 0);

-- M1-L3

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 25
(25, 'M1-L3', 'O texto descreve o efeito da dívida no cérebro como um conflito entre duas áreas. O que acontece com o Córtex Pré-Frontal (o "CEO") quando a pessoa está endividada?', 1, 'Quando a dívida ativa o estado de alerta e medo na Amígdala, o Córtex Pré-Frontal (responsável pela lógica e planejamento) é "desligado", impedindo o pensamento de longo prazo.'),

-- Questão 26
(26, 'M1-L3', 'Segundo a lição, o que é necessário para "acalmar" a Amígdala e retomar o controle mental, mesmo antes de quitar a dívida?', 2, 'O texto afirma que uma mente estável é resultado de ter um PLANO. O simples ato de parar de evitar o problema e decidir encará-lo com um método devolve a sensação de controle.'),

-- Questão 27
(27, 'M1-L3', 'No "Passo 2: A Priorização", qual critério deve ser usado para ordenar a lista de dívidas a serem atacadas primeiro?', 3, 'A prioridade deve ser baseada nas TAXAS DE JUROS. Deve-se listar das maiores taxas para as menores, atacando primeiro os "vilões" como rotativo do cartão e cheque especial.'),

-- Questão 28
(28, 'M1-L3', 'Como funciona o "Método Avalanche" descrito no Passo 4 para eliminar as dívidas de forma eficiente?', 4, 'O método consiste em pagar o mínimo de todas as outras dívidas para não sujar o nome, e focar TODO o dinheiro extra disponível para quitar a dívida prioritária (a de juros mais altos) o mais rápido possível.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 25 (IDs 97-100)
(97, 25, 'Ele trabalha em dobro para calcular os juros compostos.', 0),
(98, 25, 'Ele é "desligado" ou suprimido, dificultando o planejamento lógico.', 1),
(99, 25, 'Ele libera dopamina para fazer a pessoa se sentir feliz mesmo devendo.', 0),
(100, 25, 'Ele assume o controle total, eliminando qualquer emoção ou medo.', 0),

-- Alternativas da Questão 26 (IDs 101-104)
(101, 26, 'Ganhar na loteria para pagar tudo de uma vez.', 0),
(102, 26, 'Ignorar as ligações de cobrança até as dívidas caducarem.', 0),
(103, 26, 'Ter um plano de ação claro, pois a sensação de controle reduz a ansiedade.', 1),
(104, 26, 'Pedir mais um empréstimo para viajar e relaxar a mente.', 0),

-- Alternativas da Questão 27 (IDs 105-108)
(105, 27, 'Deve-se pagar primeiro as dívidas com os menores valores totais.', 0),
(106, 27, 'Deve-se priorizar as dívidas com amigos e familiares por questão de honra.', 0),
(107, 27, 'Deve-se priorizar as dívidas com as maiores taxas de juros.', 1),
(108, 27, 'Deve-se pagar primeiro as dívidas mais antigas.', 0),

-- Alternativas da Questão 28 (IDs 109-112)
(109, 28, 'Dividir o dinheiro extra igualmente entre todas as dívidas.', 0),
(110, 28, 'Pagar o mínimo de todas e focar todo o dinheiro extra na dívida com maiores juros.', 1),
(111, 28, 'Deixar de pagar as dívidas menores para focar apenas na maior.', 0),
(112, 28, 'Pagar primeiro a dívida que tem a parcela mais barata.', 0);

-- M1-L4

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 29
(29, 'M1-L4', 'O texto afirma que o consumo não é um ato puramente lógico. Qual é a principal força motriz por trás das compras que não precisamos, segundo a lição?', 1, 'O texto explica que o consumo é 90% emocional. Fomos "programados" e influenciados por técnicas de marketing que exploram "bugs" no nosso cérebro para gastar dinheiro.'),

-- Questão 30
(30, 'M1-L4', 'Na armadilha da "Recompensa Imediata", o que o texto diz que estamos realmente comprando quando gastamos dinheiro após um dia ruim?', 2, 'O texto esclarece que, nesses momentos, não estamos comprando o produto em si, mas sim uma dose de dopamina (neurotransmissor do prazer) para obter um alívio químico imediato para o estresse.'),

-- Questão 31
(31, 'M1-L4', 'Como o "Marketing da Urgência" (ex: "Só hoje!", "Últimas unidades") afeta o funcionamento biológico do cérebro para forçar uma compra?', 3, 'Gatilhos de urgência desligam o Córtex Pré-Frontal (a parte lógica e de planejamento) e ativam a Amígdala e o Sistema Límbico (emoção e medo), colocando o consumidor em modo "luta ou fuga".'),

-- Questão 32
(32, 'M1-L4', 'Entre as táticas de proteção ("Antivírus Financeiro"), qual é o objetivo principal da "Regra da Pausa" (esperar 72 horas antes de comprar)?', 4, 'O objetivo de esperar 72 horas é permitir que a dopamina baixe e a emoção da urgência desapareça. Isso dá tempo para o "CEO" lógico (Córtex Pré-Frontal) religar e avaliar se a compra é realmente necessária.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 29 (IDs 113-116)
(113, 29, 'É uma necessidade biológica de sobrevivência, como comer e dormir.', 0),
(114, 29, 'É um ato 90% emocional, explorado por gatilhos psicológicos.', 1),
(115, 29, 'É uma decisão puramente matemática baseada no custo-benefício.', 0),
(116, 29, 'É culpa exclusiva da inflação que nos obriga a estocar produtos.', 0),

-- Alternativas da Questão 30 (IDs 117-120)
(117, 30, 'Estamos comprando um ativo que vai nos gerar renda no futuro.', 0),
(118, 30, 'Estamos comprando status social para impressionar o chefe.', 0),
(119, 30, 'Estamos comprando uma dose de dopamina (prazer químico) para aliviar a dor.', 1),
(120, 30, 'Estamos comprando tempo livre para descansar mais.', 0),

-- Alternativas da Questão 31 (IDs 121-124)
(121, 31, 'Ele ajuda o cérebro a calcular melhor os descontos oferecidos.', 0),
(122, 31, 'Ele estimula a memória de longo prazo para lembrarmos de compras passadas.', 0),
(123, 31, 'Ele desliga o lado lógico (Córtex Pré-Frontal) e ativa o medo de perder (Amígdala).', 1),
(124, 31, 'Ele acalma o sistema nervoso, permitindo uma decisão mais lenta e racional.', 0),

-- Alternativas da Questão 32 (IDs 125-128)
(125, 32, 'Dar tempo para a dopamina baixar e a lógica retomar o controle da decisão.', 1),
(126, 32, 'Esperar que o vendedor diminua o preço por falta de interesse.', 0),
(127, 32, 'Dar tempo para pedir dinheiro emprestado para parentes.', 0),
(128, 32, 'Esperar o lançamento de uma versão mais nova do produto.', 0);


-- M2-L1

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 33
(33, 'M2-L1', 'De acordo com os dados da pesquisa PEIC apresentados no texto, qual é a situação atual do endividamento das famílias brasileiras?', 1, 'O texto cita que 78,5% das famílias estão endividadas. Isso representa uma estatística alarmante onde mais de 3 em cada 4 famílias possuem algum tipo de dívida.'),

-- Questão 34
(34, 'M2-L1', 'O texto lista quatro raízes profundas para a falta de educação financeira no Brasil. Qual das opções abaixo NÃO é uma das causas citadas?', 2, 'As causas citadas foram: ausência nas escolas (antes de 2020), tabu familiar, facilidade de crédito e cultura do consumismo. A falta de acesso à tecnologia não foi mencionada como causa.'),

-- Questão 35
(35, 'M2-L1', 'Como a educação financeira atua na proteção contra golpes, segundo o exemplo prático dado na lição?', 3, 'A educação financeira permite identificar promessas impossíveis, como o exemplo de um rendimento de 10% ao mês "garantido", sabendo que isso não existe em investimentos seguros.'),

-- Questão 36
(36, 'M2-L1', 'Qual é a principal diferença comportamental entre o "Ciclo Vicioso" e o "Ciclo Virtuoso" descrita no texto logo após o momento de "Ganhar dinheiro"?', 4, 'No Ciclo Vicioso, a pessoa "Gasta tudo". No Ciclo Virtuoso, a pessoa "Guarda uma parte" e "Investe" antes de gastar, fazendo o dinheiro render e aumentar.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 33 (IDs 129-132)
(129, 33, 'Apenas uma pequena minoria (menos de 10%) das famílias possui dívidas.', 0),
(130, 33, 'Mais de 3 em cada 4 famílias (78,5%) possuem algum tipo de dívida.', 1),
(131, 33, 'O endividamento atinge apenas as famílias que não têm emprego formal.', 0),
(132, 33, 'O Brasil zerou o índice de famílias com contas em atraso em 2023.', 0),

-- Alternativas da Questão 34 (IDs 133-136)
(133, 34, 'A ausência do tema nas escolas por muitas gerações.', 0),
(134, 34, 'O tabu familiar de considerar vergonhoso falar sobre dinheiro.', 0),
(135, 34, 'A falta de acesso a smartphones e aplicativos bancários.', 1),
(136, 34, 'A facilidade de obter crédito (cartões e empréstimos) sem orientação.', 0),

-- Alternativas da Questão 35 (IDs 137-140)
(137, 35, 'Ela ajuda a pessoa a reconhecer que retornos altíssimos e garantidos são irreais e provavelmente golpes.', 1),
(138, 35, 'Ela ensina a pessoa a hackear o sistema do golpista para recuperar o dinheiro.', 0),
(139, 35, 'Ela garante que o banco devolva qualquer dinheiro perdido em apostas.', 0),
(140, 35, 'Ela impede tecnicamente que o celular receba mensagens de desconhecidos.', 0),

-- Alternativas da Questão 36 (IDs 141-144)
(141, 36, 'No Ciclo Virtuoso, você gasta tudo no cartão de crédito para ganhar milhas.', 0),
(142, 36, 'No Ciclo Virtuoso, você guarda uma parte e investe para o dinheiro render.', 1),
(143, 36, 'No Ciclo Virtuoso, você pede um empréstimo para cobrir os gastos do mês.', 0),
(144, 36, 'No Ciclo Virtuoso, você para de trabalhar e vive apenas de doações.', 0);


-- M2-L2

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 37
(37, 'M2-L2', 'O texto descreve a economia como um "tabuleiro" onde três jogadores principais interagem constantemente. Quem são esses três jogadores?', 1, 'Os três agentes econômicos fundamentais citados no texto são as Famílias (pessoas), as Empresas (produção) e o Governo (administração).'),

-- Questão 38
(38, 'M2-L2', 'No ciclo econômico descrito, qual é a principal troca realizada pelas "Famílias" para obter renda?', 2, 'As famílias oferecem sua força de trabalho para as empresas e, em troca, recebem salários, os quais utilizam para consumir produtos, pagar impostos e investir.'),

-- Questão 39
(39, 'M2-L2', 'Segundo o texto, qual é a principal ferramenta que o governo utiliza para controlar a inflação e manter o poder de compra do dinheiro?', 3, 'O texto identifica a Taxa Selic (a taxa básica de juros da economia) como a ferramenta principal usada pelo governo para o controle da inflação.'),

-- Questão 40
(40, 'M2-L2', 'Quando o governo precisa de dinheiro extra para financiar suas atividades, além dos impostos, como ele consegue pegar esse valor emprestado da sociedade?', 4, 'O governo emite Títulos Públicos. As pessoas podem emprestar dinheiro ao governo comprando esses títulos através do programa Tesouro Direto.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 37 (IDs 145-148)
(145, 37, 'Os Bancos, a Bolsa de Valores e o Dólar.', 0),
(146, 37, 'As Famílias, as Empresas e o Governo.', 1),
(147, 37, 'Os Prefeitos, os Governadores e o Presidente.', 0),
(148, 37, 'Os Empregados, os Desempregados e os Aposentados.', 0),

-- Alternativas da Questão 38 (IDs 149-152)
(149, 38, 'Elas imprimem dinheiro em casa para pagar as contas.', 0),
(150, 38, 'Elas vendem todas as suas propriedades para as empresas.', 0),
(151, 38, 'Elas oferecem sua força de trabalho em troca de salários.', 1),
(152, 38, 'Elas esperam o governo distribuir todo o lucro das empresas.', 0),

-- Alternativas da Questão 39 (IDs 153-156)
(153, 39, 'O congelamento obrigatório de todos os preços nos supermercados.', 0),
(154, 39, 'A impressão de mais notas de dinheiro para distribuir à população.', 0),
(155, 39, 'A Taxa Selic, que é a taxa básica de juros da economia.', 1),
(156, 39, 'O aumento dos impostos sobre a exportação de produtos.', 0),

-- Alternativas da Questão 40 (IDs 157-160)
(157, 40, 'Emitindo Títulos Públicos através do Tesouro Direto.', 1),
(158, 40, 'Confiscando temporariamente a poupança dos cidadãos.', 0),
(159, 40, 'Pedindo doações voluntárias em redes sociais.', 0),
(160, 40, 'Vendendo todas as empresas estatais para países estrangeiros.', 0);

-- M2-L3
INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 41
(41, 'M2-L3', 'Qual é a definição de "Reserva de Emergência" apresentada no texto e qual a base de cálculo recomendada pelos especialistas?', 1, 'O texto define a reserva como um valor investido para segurar impactos de imprevistos. O cálculo recomendado é acumular entre 6 a 12 meses dos seus custos fixos mensais (e não necessariamente do salário total).'),

-- Questão 42
(42, 'M2-L3', 'Para que a reserva de emergência cumpra sua função de segurança imediata, qual característica técnica o investimento escolhido deve obrigatoriamente ter?', 2, 'A característica essencial citada é a "liquidez diária", ou seja, a possibilidade de sacar o dinheiro a qualquer momento (24h por dia ou em dias úteis imediatos), como em CDBs de bancos confiáveis ou Tesouro Selic.'),

-- Questão 43
(43, 'M2-L3', 'Antes de começar a poupar, o texto sugere uma etapa de "organização das contas". Qual atitude é fundamental nessa fase?', 3, 'O texto enfatiza a necessidade de ser honesto consigo mesmo, listando ganhos reais e identificando gastos que podem ser reduzidos ou cortados (como excesso de delivery ou transporte por conveniência).'),

-- Questão 44
(44, 'M2-L3', 'No exemplo "O poder do tempo", Alice e Bernardo investem o mesmo valor (R$ 500) até os 60 anos. Por que o resultado de Alice é muito superior?', 4, 'A vantagem de Alice não foi o valor investido, mas o tempo. Ela começou 10 anos antes (aos 20, contra 30 de Bernardo), permitindo que os juros compostos trabalhassem por muito mais tempo (Efeito Snowball).');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 41 (IDs 161-164)
(161, 41, 'É um dinheiro para viagens de luxo, calculado com base em 1 mês de salário.', 0),
(162, 41, 'É um valor para cobrir imprevistos, equivalente a 6 a 12 meses dos custos fixos mensais.', 1),
(163, 41, 'É um investimento de alto risco para dobrar o capital em 3 meses.', 0),
(164, 41, 'É uma poupança destinada apenas para a compra de imóveis, sem prazo definido.', 0),

-- Alternativas da Questão 42 (IDs 165-168)
(165, 42, 'Deve ter liquidez diária, permitindo o saque a qualquer momento.', 1),
(166, 42, 'Deve ter carência de no mínimo 2 anos para garantir maior rentabilidade.', 0),
(167, 42, 'Deve ser investido exclusivamente em ações voláteis da bolsa de valores.', 0),
(168, 42, 'Deve estar trancado em um cofre físico dentro de casa.', 0),

-- Alternativas da Questão 43 (IDs 169-172)
(169, 43, 'Pedir um empréstimo bancário para ter dinheiro inicial para investir.', 0),
(170, 43, 'Ser honesto consigo mesmo e identificar gastos supérfluos que podem ser reduzidos.', 1),
(171, 43, 'Ignorar as dívidas atuais e focar apenas no futuro.', 0),
(172, 43, 'Aumentar o limite do cartão de crédito para usar como reserva.', 0),

-- Alternativas da Questão 44 (IDs 173-176)
(173, 44, 'Porque Alice investiu o dobro do valor mensal que Bernardo investiu.', 0),
(174, 44, 'Porque Alice escolheu um investimento de altíssimo risco e Bernardo foi conservador.', 0),
(175, 44, 'Porque Alice começou a investir 10 anos mais cedo, aproveitando o efeito dos juros compostos.', 1),
(176, 44, 'Porque Bernardo parou de investir no meio do caminho.', 0);

-- M2-L4

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 45
(45, 'M2-L4', 'O texto usa a metáfora do "ladrão silencioso" para descrever a inflação. Na prática, o que esse fenômeno causa no seu dinheiro?', 1, 'A inflação é o aumento generalizado e contínuo dos preços. Na prática, ela diminui o poder de compra, fazendo com que a mesma quantidade de dinheiro compre cada vez menos produtos e serviços.'),

-- Questão 46
(46, 'M2-L4', 'No Brasil, existe um índice oficial considerado o principal termômetro da inflação. Qual é o nome desse índice e quem o calcula?', 2, 'O texto cita o IPCA (Índice de Preços ao Consumidor Amplo) como a medida oficial, sendo calculado pelo IBGE (Instituto Brasileiro de Geografia e Estatística).'),

-- Questão 47
(47, 'M2-L4', 'Como o IBGE chega ao número da inflação (ex: "0,5% no mês")? Qual é a metodologia explicada no texto?', 3, 'O IBGE monitora o preço de uma "cesta de compras" hipotética que representa os gastos comuns da maioria das famílias brasileiras, incluindo desde alimentos (arroz, feijão) até serviços (luz, aluguel).'),

-- Questão 48
(48, 'M2-L4', 'Por que deixar dinheiro parado na conta corrente ou na poupança é considerado uma má estratégia em tempos de inflação alta?', 4, 'O texto explica que a inflação "desvaloriza suas economias". Se o dinheiro não estiver investido em algo que renda acima da inflação, ele perde valor real, ou seja, você empobrece mesmo tendo o dinheiro guardado.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 45 (IDs 177-180)
(177, 45, 'Ela faz o dinheiro valer mais, permitindo comprar produtos melhores.', 0),
(178, 45, 'Ela diminui o valor do dinheiro, corroendo o poder de compra ao longo do tempo.', 1),
(179, 45, 'Ela mantém os preços estáveis, garantindo previsibilidade total.', 0),
(180, 45, 'Ela obriga o governo a imprimir mais notas para distribuir à população.', 0),

-- Alternativas da Questão 46 (IDs 181-184)
(181, 46, 'Taxa Selic, calculada pelo Banco Central.', 0),
(182, 46, 'PIB (Produto Interno Bruto), calculado pelo Ministério da Economia.', 0),
(183, 46, 'IPCA (Índice de Preços ao Consumidor Amplo), calculado pelo IBGE.', 1),
(184, 46, 'IGP-M, calculado pela Fundação Getúlio Vargas.', 0),

-- Alternativas da Questão 47 (IDs 185-188)
(185, 47, 'Monitorando uma "cesta de compras" com itens essenciais como alimentos, transporte e moradia.', 1),
(186, 47, 'Perguntando aleatoriamente para pessoas na rua quanto elas gastaram no dia.', 0),
(187, 47, 'Baseando-se apenas na variação do preço do dólar americano.', 0),
(188, 47, 'Calculando apenas o aumento dos impostos federais sobre produtos importados.', 0),

-- Alternativas da Questão 48 (IDs 189-192)
(189, 48, 'Porque o banco cobra uma taxa de "inatividade" se o dinheiro não for movimentado.', 0),
(190, 48, 'Porque o dinheiro perde valor real de compra, já que os preços sobem e o saldo parado não acompanha.', 1),
(191, 48, 'Porque a inflação faz o dinheiro render o dobro automaticamente na conta corrente.', 0),
(192, 48, 'Porque o governo confisca poupanças quando a inflação passa de 10%.', 0);

-- M2-L5
INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 49
(49, 'M2-L5', 'O texto define a Taxa Selic como o "preço do dinheiro" e a "taxa básica de juros". Qual é a principal função dessa ferramenta para o Banco Central?', 1, 'A principal função da Selic é servir como ferramenta de política monetária para controlar a inflação. O Banco Central a utiliza para "esfriar" ou "aquecer" a economia conforme necessário.'),

-- Questão 50
(50, 'M2-L5', 'Qual é a relação direta entre o aumento da Taxa Selic e o comportamento dos consumidores e empresas?', 2, 'Quando a Selic aumenta, o crédito fica mais caro e os investimentos em renda fixa ficam mais atraentes. Isso faz com que pessoas e empresas consumam menos e poupem mais, diminuindo a pressão sobre os preços (inflação).'),

-- Questão 51
(51, 'M2-L5', 'O texto traz um alerta matemático importante sobre investimentos e inflação. O que acontece se a inflação for de 7% ao ano e o seu investimento render apenas 5%?', 3, 'Nesse cenário, apesar de haver um ganho nominal (numérico), você está perdendo poder de compra, pois o rendimento do investimento não foi suficiente para repor a desvalorização causada pela inflação.'),

-- Questão 52
(52, 'M2-L5', 'Como a Taxa Selic influencia a atratividade dos investimentos em Renda Fixa (como Tesouro Direto e CDBs)?', 4, 'A Selic dita a regra: quando ela está alta, a Renda Fixa se torna a "estrela", oferecendo bons rendimentos com segurança. Quando está baixa, os investidores tendem a buscar mais risco na bolsa para obter retornos maiores.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 49 (IDs 193-196)
(193, 49, 'Definir o preço máximo de produtos essenciais nos supermercados.', 0),
(194, 49, 'Controlar a inflação e regular a atividade econômica ("esfriar" ou "aquecer").', 1),
(195, 49, 'Determinar quanto cada empresa deve pagar de salário aos funcionários.', 0),
(196, 49, 'Imprimir dinheiro para pagar a dívida externa do país.', 0),

-- Alternativas da Questão 50 (IDs 197-200)
(197, 50, 'O aumento da Selic faz o crédito ficar mais barato, incentivando compras desenfreadas.', 0),
(198, 50, 'O aumento da Selic torna o crédito mais caro, desestimulando o consumo e ajudando a baixar a inflação.', 1),
(199, 50, 'O aumento da Selic obriga as empresas a contratarem mais funcionários imediatamente.', 0),
(200, 50, 'O aumento da Selic não afeta em nada a vida das pessoas comuns, apenas dos bancos.', 0),

-- Alternativas da Questão 51 (IDs 201-204)
(201, 51, 'Você tem um lucro real de 2%, pois 7 menos 5 é igual a 2.', 0),
(202, 51, 'Você empata seu dinheiro, mantendo exatamente o mesmo poder de compra.', 0),
(203, 51, 'Você perde poder de compra, pois o rendimento foi inferior à inflação.', 1),
(204, 51, 'Você fica rico rapidamente, pois 5% é um retorno excelente em qualquer cenário.', 0),

-- Alternativas da Questão 52 (IDs 205-208)
(205, 52, 'Com a Selic alta, a Renda Fixa paga menos, fazendo todos correrem para a Bolsa.', 0),
(206, 52, 'A Selic não afeta a Renda Fixa, pois ela só serve para empréstimos bancários.', 0),
(207, 52, 'Com a Selic alta, a Renda Fixa se torna mais atrativa e segura, pagando juros maiores.', 1),
(208, 52, 'Com a Selic baixa, a Renda Fixa se torna perigosa e deve ser evitada a todo custo.', 0);

-- M2-L6

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 53
(53, 'M2-L6', 'O texto faz uma distinção clara entre Crédito e Dívida. Qual é a definição de Crédito apresentada?', 1, 'O texto define Crédito como um "voto de confiança" ou permissão que as instituições dão para você antecipar o consumo ou investimento (comprar agora e pagar depois). A dívida é apenas a consequência do uso desse crédito.'),

-- Questão 54
(54, 'M2-L6', 'Qual é a principal característica do que o texto classifica como "Dívida Boa" (ou Dívida de Alavancagem)?', 2, 'A Dívida Boa é aquela contraída para adquirir bens ou serviços que vão aumentar seu patrimônio ou gerar renda no futuro, como financiar um imóvel ou investir em um negócio próprio.'),

-- Questão 55
(55, 'M2-L6', 'Por que o financiamento de um carro é citado no texto como um exemplo de "Dívida Ruim" (Dívida de Consumo)?', 3, 'O texto classifica o financiamento de veículos como dívida ruim porque o carro é um bem que perde valor (deprecia) rapidamente assim que sai da concessionária, além de consumir renda futura sem gerar riqueza.'),

-- Questão 56
(56, 'M2-L6', 'Sobre o uso do Cartão de Crédito, o texto estabelece uma "Regra de Ouro" para evitar cair na armadilha do crédito rotativo. Qual é essa regra?', 4, 'A regra de ouro é tratar o cartão como meio de pagamento, não de crédito, e SEMPRE pagar a fatura inteira. Pagar menos que o total aciona os juros mais altos do mercado.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 53 (IDs 209-212)
(209, 53, 'Crédito é o dinheiro que você ganha de presente do banco por ser um bom cliente.', 0),
(210, 53, 'Crédito é um voto de confiança, uma permissão para comprar agora e pagar depois.', 1),
(211, 53, 'Crédito é exatamente a mesma coisa que Dívida, não há diferença.', 0),
(212, 53, 'Crédito é o valor que sobra na sua conta depois de pagar todas as contas.', 0),

-- Alternativas da Questão 54 (IDs 213-216)
(213, 54, 'É aquela que possui juros zero, independentemente do que você compre.', 0),
(214, 54, 'É aquela feita para comprar itens de luxo que impressionam os outros.', 0),
(215, 54, 'É aquela usada para comprar algo que vai aumentar seu patrimônio ou gerar renda.', 1),
(216, 54, 'É aquela que você nunca precisa pagar de volta.', 0),

-- Alternativas da Questão 55 (IDs 217-220)
(217, 55, 'Porque carros poluem o meio ambiente e o texto foca em sustentabilidade.', 0),
(218, 55, 'Porque o carro perde valor rapidamente e a dívida não gera retorno financeiro.', 1),
(219, 55, 'Porque é impossível conseguir crédito para comprar carros no Brasil.', 0),
(220, 55, 'Porque ter carro próprio é proibido para quem quer investir.', 0),

-- Alternativas da Questão 56 (IDs 221-224)
(221, 56, 'Parcelar a fatura sempre que possível para sobrar dinheiro no mês.', 0),
(222, 56, 'Sempre pagar a fatura inteira, pois o cartão é ferramenta de pagamento.', 1),
(223, 56, 'Pagar apenas o mínimo da fatura para manter o crédito ativo.', 0),
(224, 56, 'Usar o cheque especial para pagar a fatura do cartão.', 0);

-- M2-L7

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 57
(57, 'M2-L7', 'O texto compara os Juros Compostos a uma "bola de neve". O que essa metáfora significa na prática financeira?', 1, 'Significa o conceito de "juros sobre juros". Assim como a bola de neve cresce ao rolar acumulando mais neve, o dinheiro cresce mais rápido porque os rendimentos passados passam a render novos juros.'),

-- Questão 58
(58, 'M2-L7', 'Qual é a principal regra de cálculo dos Juros Simples que os diferencia dos Juros Compostos?', 2, 'Nos Juros Simples, o rendimento é calculado SEMPRE sobre o valor inicial investido. O lucro não se incorpora ao montante para gerar novos lucros no período seguinte.'),

-- Questão 59
(59, 'M2-L7', 'Ao comparar os dois tipos de juros no exemplo de 3 anos, por que o montante final dos Juros Compostos foi maior (R$ 1.331) que o dos Simples (R$ 1.300)?', 3, 'Porque nos juros compostos, a base de cálculo aumentou a cada ano (R$ 1.000 -> R$ 1.100 -> R$ 1.210), gerando juros sobre o saldo acumulado, enquanto nos simples a base foi sempre R$ 1.000.'),

-- Questão 60
(60, 'M2-L7', 'Embora a maioria dos investimentos use juros compostos, onde o texto afirma que é comum encontrarmos a aplicação de Juros Simples no dia a dia?', 4, 'O texto cita que juros simples são encontrados em cálculos de mora (multa) por atraso em boletos, descontos por antecipação e algumas modalidades de empréstimo de curtíssimo prazo.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 57 (IDs 225-228)
(225, 57, 'Significa que o dinheiro derrete e desaparece se você não cuidar dele.', 0),
(226, 57, 'Significa que você ganha juros sobre os juros que já ganhou, acelerando o crescimento.', 1),
(227, 57, 'Significa que você deve investir apenas no inverno para ter lucro.', 0),
(228, 57, 'Significa que o rendimento é linear e previsível, sem surpresas.', 0),

-- Alternativas da Questão 58 (IDs 229-232)
(229, 58, 'O cálculo é feito sempre sobre o valor inicial investido, ignorando os lucros anteriores.', 1),
(230, 58, 'O cálculo depende exclusivamente da variação do dólar.', 0),
(231, 58, 'O cálculo é feito sobre o valor acumulado mês a mês.', 0),
(232, 58, 'O cálculo dos juros simples sempre resulta em um valor maior que os compostos.', 0),

-- Alternativas da Questão 59 (IDs 233-236)
(233, 59, 'Porque a taxa de juros do exemplo simples era menor que 10%.', 0),
(234, 59, 'Porque nos juros compostos houve a incidência de juros sobre os juros acumulados nos anos anteriores.', 1),
(235, 59, 'Foi apenas sorte, pois normalmente os juros simples rendem mais.', 0),
(236, 59, 'Porque no juro simples o banco cobra uma taxa de administração maior.', 0),

-- Alternativas da Questão 60 (IDs 237-240)
(237, 60, 'Nos investimentos de longo prazo como o Tesouro Direto.', 0),
(238, 60, 'Em multas por atraso de boletos e empréstimos de curtíssimo prazo.', 1),
(239, 60, 'Apenas em transações internacionais de importação.', 0),
(240, 60, 'No rendimento da caderneta de poupança.', 0);

-- M2-L8

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 61
(61, 'M2-L8', 'O texto define uma "Ação" de forma bem específica. Ao comprar uma ação de uma empresa na Bolsa (B3), qual é o papel que o investidor assume?', 1, 'Ao comprar uma ação, você compra a menor parte de uma empresa de capital aberto e se torna SÓCIO dela (dono de um pedacinho). Diferente da renda fixa, você não é um credor que emprestou dinheiro, mas um parceiro no negócio.'),

-- Questão 62
(62, 'M2-L8', 'Segundo a lição, existem duas formas principais de ganhar dinheiro na Bolsa de Valores. Quais são elas?', 2, 'O texto cita: 1. Valorização da Ação (ganho de capital quando o preço sobe e você vende mais caro) e 2. Dividendos (quando a empresa distribui parte dos lucros aos sócios periodicamente).'),

-- Questão 63
(63, 'M2-L8', 'O Ibovespa (IBOV) é frequentemente citado nos jornais. O que esse índice representa, segundo o texto?', 3, 'O Ibovespa é descrito como o "termômetro" do mercado. Ele não representa todas as ações, mas sim uma carteira teórica composta pelas ações mais importantes e negociadas da B3.'),

-- Questão 64
(64, 'M2-L8', 'O texto faz um alerta importante sobre o risco da Bolsa de Valores (Volatilidade). Por que ela NÃO é recomendada para sua Reserva de Emergência?', 4, 'Como não há garantia de retorno e os preços sofrem "sobe e desce" (volatilidade), você pode ter prejuízo se precisar sacar rápido. A Bolsa é indicada para longo prazo (aposentadoria, grandes objetivos), não para emergências.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 61 (IDs 241-244)
(241, 61, 'Ele se torna um funcionário da empresa, com obrigações trabalhistas.', 0),
(242, 61, 'Ele se torna um credor, emprestando dinheiro com garantia de devolução.', 0),
(243, 61, 'Ele se torna sócio da empresa, dono de um pequeno pedaço do negócio.', 1),
(244, 61, 'Ele se torna dono da Bolsa de Valores inteira.', 0),

-- Alternativas da Questão 62 (IDs 245-248)
(245, 62, 'Valorização da ação (vender mais caro) e recebimento de Dividendos (parte dos lucros).', 1),
(246, 62, 'Sorteios mensais de prêmios e Juros da Poupança.', 0),
(247, 62, 'Pagamento de horas extras e décimo terceiro salário.', 0),
(248, 62, 'Restituição do Imposto de Renda e Isenção fiscal total.', 0),

-- Alternativas da Questão 63 (IDs 249-252)
(249, 63, 'É uma empresa que controla todos os bancos do Brasil.', 0),
(250, 63, 'É um índice que funciona como termômetro, reunindo as ações mais importantes e negociadas.', 1),
(251, 63, 'É o valor total da dívida pública do governo federal.', 0),
(252, 63, 'É o nome do prédio onde a Bolsa de Valores está localizada.', 0),

-- Alternativas da Questão 64 (IDs 253-256)
(253, 64, 'Porque a Bolsa fecha nos finais de semana e feriados.', 0),
(254, 64, 'Porque é proibido sacar o dinheiro antes de 30 anos de investimento.', 0),
(255, 64, 'Porque existe volatilidade e risco de perda no curto prazo; ela serve para o longo prazo.', 1),
(256, 64, 'Porque o rendimento da Bolsa é sempre menor que o da inflação.', 0);


-- M2-L9

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 65
(65, 'M2-L9', 'O texto apresenta o SFN (Sistema Financeiro Nacional) como uma peça fundamental para a segurança do investidor. Qual é a definição dada ao SFN?', 1, 'O SFN é definido como o conjunto de regras, instituições e fiscalizadores que fazem a economia girar de forma ordenada. Ele atua como a primeira camada de segurança, garantindo que o "jogo" tenha regras claras.'),

-- Questão 66
(66, 'M2-L9', 'Entre os órgãos apresentados, o CMN (Conselho Monetário Nacional) é descrito como o "Grande Estrategista". Qual é a sua função principal?', 2, 'O CMN é o órgão máximo do sistema. Sua função é definir as regras (normatizar) a política de moeda e crédito, mas ele não executa as tarefas do dia a dia; ele manda.'),

-- Questão 67
(67, 'M2-L9', 'A CVM (Comissão de Valores Mobiliários) é chamada de "Xerife do Mercado de Investimentos". Por que ela é considerada o principal aliado do investidor?', 3, 'Porque a CVM é responsável por fiscalizar a Bolsa de Valores, Fundos e Corretoras. É ela quem combate fraudes, pirâmides financeiras e verifica se as ofertas de investimento são autorizadas.'),

-- Questão 68
(68, 'M2-L9', 'O FGC (Fundo Garantidor de Créditos) é descrito como o "seguro" ou "cinto de segurança" do investidor de Renda Fixa. O que ele garante?', 4, 'O FGC garante o dinheiro investido em produtos bancários (como CDBs, LCIs, LCAs) até o limite de R$ 250 mil por CPF, caso a instituição financeira (banco) venha a quebrar (falir).');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 65 (IDs 257-260)
(257, 65, 'É um banco único onde todo o dinheiro do Brasil fica guardado fisicamente.', 0),
(258, 65, 'É o conjunto de regras, instituições e fiscalizadores que organizam a economia.', 1),
(259, 65, 'É um aplicativo de celular obrigatório para fazer pagamentos.', 0),
(260, 65, 'É uma organização internacional que empresta dinheiro para o governo.', 0),

-- Alternativas da Questão 66 (IDs 261-264)
(261, 66, 'Sua função é imprimir o dinheiro e distribuir para os bancos.', 0),
(262, 66, 'Sua função é atender diretamente os clientes nos caixas eletrônicos.', 0),
(263, 66, 'Sua função é definir as regras principais da política de moeda e crédito (normatizar).', 1),
(264, 66, 'Sua função é garantir o lucro de todas as empresas da Bolsa.', 0),

-- Alternativas da Questão 67 (IDs 265-268)
(265, 67, 'Porque ela define o valor da Taxa Selic a cada 45 dias.', 0),
(266, 67, 'Porque ela fiscaliza a Bolsa e as Corretoras, combatendo fraudes e protegendo o investidor.', 1),
(267, 67, 'Porque ela empresta dinheiro a juros baixos para quem quer comprar ações.', 0),
(268, 67, 'Porque ela garante que as ações nunca caiam de preço.', 0),

-- Alternativas da Questão 68 (IDs 269-272)
(269, 68, 'Ele garante o reembolso de qualquer prejuízo que você tiver na Bolsa de Valores.', 0),
(270, 68, 'Ele garante o pagamento de até R$ 250 mil caso o banco emissor de um CDB quebre.', 1),
(271, 68, 'Ele garante que você nunca ficará com o nome sujo no SPC/Serasa.', 0),
(272, 68, 'Ele garante rentabilidade de 100% ao mês em qualquer investimento.', 0);


-- M3-L1

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 69
(69, 'M3-L1', 'Logo no início da lição, é apresentada uma definição básica do ato de "investir". O que isso significa essencialmente?', 1, 'O texto define investir como o ato de emprestar uma quantia de dinheiro (para um banco, governo ou empresa) com a expectativa de receber uma quantidade maior no futuro, baseada em juros.'),

-- Questão 70
(70, 'M3-L1', 'Na Renda Variável, a dinâmica muda em relação à Renda Fixa. Qual é a principal característica que define a posição do investidor nessa modalidade?', 2, 'Na Renda Variável, você não está apenas "emprestando" dinheiro; você se torna SÓCIO de empresas ou dono de ativos. Por isso, não há remuneração garantida e o retorno depende da performance do negócio.'),

-- Questão 71
(71, 'M3-L1', 'Entre os tipos de investimentos de Renda Variável citados, qual é a principal vantagem destacada dos Fundos de Investimento Imobiliário (FIIs)?', 3, 'Os FIIs são destacados pela vantagem de gerar renda passiva frequente através do recebimento de rendimentos mensais (como aluguéis), que geralmente são isentos de Imposto de Renda para pessoa física.'),

-- Questão 72
(72, 'M3-L1', 'O texto revisita o conceito de Juros Simples para contrastá-lo com os Compostos. Qual é a regra de cálculo que torna o crescimento dos Juros Simples "linear"?', 4, 'Nos Juros Simples, o rendimento é calculado SEMPRE sobre o valor inicial investido. O lucro de um mês não é somado à base para gerar novos lucros no mês seguinte, resultando em um crescimento em linha reta.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 69 (IDs 273-276)
(273, 69, 'Investir é guardar dinheiro embaixo do colchão para emergências.', 0),
(274, 69, 'Investir é emprestar dinheiro (banco/governo/empresa) para receber com juros depois.', 1),
(275, 69, 'Investir é gastar todo o salário em bens de consumo duráveis.', 0),
(276, 69, 'Investir é pagar todas as dívidas antes do vencimento.', 0),

-- Alternativas da Questão 70 (IDs 277-280)
(277, 70, 'Você se torna um credor com garantia total do governo sobre o lucro.', 0),
(278, 70, 'Você se torna sócio ou dono de ativos, sem garantia de retorno pré-definido.', 1),
(279, 70, 'Você empresta dinheiro ao banco com uma taxa de juros fixa e imutável.', 0),
(280, 70, 'Você aposta na loteria esperando um retorno rápido e garantido.', 0),

-- Alternativas da Questão 71 (IDs 281-284)
(281, 71, 'A possibilidade de comprar ações de empresas estrangeiras como a Apple.', 0),
(282, 71, 'A garantia de que o imóvel nunca ficará vago.', 0),
(283, 71, 'O recebimento de rendimentos mensais (aluguéis) isentos de Imposto de Renda.', 1),
(284, 71, 'A taxa de administração zero em todos os fundos disponíveis.', 0),

-- Alternativas da Questão 72 (IDs 285-288)
(285, 72, 'O rendimento é calculado sobre o valor acumulado mês a mês (juros sobre juros).', 0),
(286, 72, 'O rendimento é calculado sempre sobre o valor inicial investido.', 1),
(287, 72, 'O rendimento é aleatório e depende da sorte do investidor.', 0),
(288, 72, 'O rendimento diminui conforme o tempo passa.', 0);

-- M3-L2
INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 73
(73, 'M3-L2', 'Apesar de ser o investimento mais popular do Brasil pela sua simplicidade, qual é a principal desvantagem da Poupança apontada no texto?', 1, 'O grande problema da Poupança é o baixo rendimento. O texto destaca que ela rende muito pouco, muitas vezes perdendo para a inflação, o que diminui o poder de compra do dinheiro parado lá.'),

-- Questão 74
(74, 'M3-L2', 'Como funciona a regra do "Aniversário da Poupança" e qual o risco de ignorá-la ao fazer um saque?', 2, 'A poupança só paga rendimentos uma vez por mês, na data de aniversário do depósito. Se o saque for feito um dia antes dessa data, o investidor perde todo o rendimento daquele mês.'),

-- Questão 75
(75, 'M3-L2', 'O Tesouro Selic é apresentado como uma alternativa superior para a Reserva de Emergência. Qual é a vantagem dele em relação ao "aniversário" da poupança?', 3, 'Diferente da poupança, o Tesouro Selic não tem aniversário mensal; ele rende todos os dias úteis. Se o dinheiro ficar investido por apenas 3 dias, ele renderá o proporcional a esses 3 dias.'),

-- Questão 76
(76, 'M3-L2', 'Na comparação entre os dois investimentos, existe uma diferença tributária importante. Como funciona a cobrança de impostos no Tesouro Selic?', 4, 'Enquanto a Poupança é isenta, o Tesouro Selic possui cobrança de Imposto de Renda (IR). No entanto, o imposto incide APENAS sobre o lucro (rendimento), e não sobre o valor total investido.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 73 (IDs 289-292)
(289, 73, 'Ela exige um valor mínimo muito alto para começar a investir.', 0),
(290, 73, 'O dinheiro fica bloqueado por 2 anos sem poder sacar.', 0),
(291, 73, 'Ela tem baixo rendimento e muitas vezes perde para a inflação.', 1),
(292, 73, 'Ela cobra taxas de administração abusivas dos bancos.', 0),

-- Alternativas da Questão 74 (IDs 293-296)
(293, 74, 'Você paga uma multa de 10% sobre o valor sacado.', 0),
(294, 74, 'Você perde todo o rendimento acumulado naquele mês específico.', 1),
(295, 74, 'O banco bloqueia sua conta por falta de aviso prévio.', 0),
(296, 74, 'Nada acontece, pois a poupança tem rendimento diário garantido.', 0),

-- Alternativas da Questão 75 (IDs 297-300)
(297, 75, 'Ele dobra o valor investido a cada aniversário de 1 ano.', 0),
(298, 75, 'Ele rende todos os dias úteis, sem a necessidade de esperar um mês completo.', 1),
(299, 75, 'Ele permite saques aos finais de semana, diferente da poupança.', 0),
(300, 75, 'Ele não cobra imposto de renda se você sacar no dia do aniversário.', 0),

-- Alternativas da Questão 76 (IDs 301-304)
(301, 76, 'O Tesouro Selic é isento de impostos, assim como a Poupança.', 0),
(302, 76, 'O Imposto de Renda é cobrado sobre o valor total (principal + juros).', 0),
(303, 76, 'Você paga uma taxa fixa de R$ 50,00 por ano para o governo.', 0),
(304, 76, 'O Imposto de Renda é cobrado apenas sobre o lucro (rendimento) obtido.', 1);

-- M2-L3

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 77
(77, 'M3-L3', 'O texto define o FGC (Fundo Garantidor de Créditos) como uma peça fundamental de segurança. Qual é a natureza jurídica e a função principal desse órgão?', 1, 'O FGC não é um banco nem um órgão do governo, mas sim uma entidade privada sem fins lucrativos (uma "associação de bancos") que administra um fundo para reembolsar investidores caso uma instituição financeira quebre.'),

-- Questão 78
(78, 'M3-L3', 'Existe uma "armadilha" detalhada no texto sobre o limite de cobertura de R$ 250.000,00. Como esse limite se aplica no caso de Conglomerados Financeiros?', 2, 'O texto alerta que o limite de R$ 250 mil é por "Conglomerado Financeiro" e não por banco isolado. Se você tiver investimentos em dois bancos do mesmo grupo (ex: Itaú e Itaú BBA), os valores são somados para o cálculo do limite.'),

-- Questão 79
(79, 'M3-L3', 'O texto afirma que o Tesouro Direto NÃO possui cobertura do FGC. Por que, mesmo assim, ele é considerado o investimento mais seguro do país?', 3, 'O Tesouro Direto possui uma garantia considerada superior à do FGC: a garantia do Governo Federal (Tesouro Nacional), conhecida como "Risco Soberano". Para ele quebrar, o país inteiro teria que colapsar antes.'),

-- Questão 80
(80, 'M3-L3', 'Se a sua corretora de valores quebrar, o que acontece com seus investimentos em Ações, FIIs ou Tesouro Direto, segundo o conceito de "Segregação Patrimonial"?', 4, 'Devido à segregação patrimonial, seus ativos não se misturam com os da corretora; eles ficam registrados em seu CPF na B3 ou no Tesouro. Se a corretora quebrar, basta solicitar a transferência de custódia para outra instituição.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 77 (IDs 305-308)
(305, 77, 'É um departamento do Governo Federal que imprime dinheiro para pagar dívidas.', 0),
(306, 77, 'É uma entidade privada que funciona como uma associação de bancos para proteger investidores.', 1),
(307, 77, 'É uma seguradora internacional que cobra mensalidade dos investidores.', 0),
(308, 77, 'É o órgão responsável por definir a Taxa Selic a cada 45 dias.', 0),

-- Alternativas da Questão 78 (IDs 309-312)
(309, 78, 'O limite dobra para R$ 500.000,00 se os bancos forem do mesmo dono.', 0),
(310, 78, 'O limite se aplica à soma dos investimentos em todas as instituições do mesmo conglomerado.', 1),
(311, 78, 'O limite é cancelado se o banco fizer parte de um conglomerado internacional.', 0),
(312, 78, 'O limite é individual por cada agência bancária onde você tem conta.', 0),

-- Alternativas da Questão 79 (IDs 313-316)
(313, 79, 'Porque ele possui a garantia do Governo Federal ("Risco Soberano"), que é superior à do FGC.', 1),
(314, 79, 'Porque o FGC cobre o Tesouro Direto apenas em dias úteis.', 0),
(315, 79, 'Porque é um investimento de renda variável e pode dobrar de valor em um dia.', 0),
(316, 79, 'Porque ele é isento de qualquer tipo de risco, inclusive de mercado.', 0),

-- Alternativas da Questão 80 (IDs 317-320)
(317, 80, 'Você perde tudo, pois o dinheiro estava na conta da corretora.', 0),
(318, 80, 'O FGC devolve o valor das ações até o limite de R$ 250 mil.', 0),
(319, 80, 'Seus ativos estão registrados em seu nome na B3/Tesouro e basta transferir para outra corretora.', 1),
(320, 80, 'O governo confisca os ativos para pagar as dívidas da corretora falida.', 0);

-- M3-L4

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 81
(81, 'M3-L4', 'Segundo o texto, qual deve ser o verdadeiro objetivo da Renda Extra e qual a armadilha mais comum a ser evitada?', 1, 'O objetivo da renda extra é servir como "combustível" para aumentar os aportes nos investimentos (acelerando os juros compostos), e não para gastar mais no dia a dia. A armadilha a ser evitada é a "Inflação do Estilo de Vida" (ganhar mais e gastar mais).'),

-- Questão 82
(82, 'M3-L4', 'O texto divide a renda extra em duas categorias. O que caracteriza a "Renda Ativa (Linear)"?', 2, 'Renda Ativa é a troca direta de tempo por dinheiro (ex: dirigir Uber, dar aulas). Sua principal desvantagem é ser limitada pelas horas do dia (linear) e trazer o risco de esgotamento (burnout), pois se você parar de trabalhar, a renda para.'),

-- Questão 83
(83, 'M3-L4', 'Qual é a principal vantagem da "Renda Passiva ou Escalável" (Não-Linear) em comparação com a renda ativa?', 3, 'A principal vantagem é a escalabilidade. Ela quebra a barreira do "tempo = dinheiro", permitindo que um trabalho feito uma única vez (como criar um e-book ou software) gere renda múltiplas vezes sem esforço adicional proporcional.'),

-- Questão 84
(84, 'M3-L4', 'No exemplo do "Inventário de Habilidades" para um programador, qual das opções abaixo representa uma forma de Renda Escalável (e não apenas ativa)?', 4, 'O texto diferencia o "freelance" (ativo) da criação de produtos (escalável). Para um programador, criar um plugin, template ou um pequeno app (SaaS) é escalável, pois o mesmo código pode ser vendido para milhares de pessoas.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 81 (IDs 321-324)
(321, 81, 'O objetivo é poder comprar um carro de luxo imediatamente; a armadilha é investir demais.', 0),
(322, 81, 'O objetivo é aumentar o aporte nos investimentos; a armadilha é a Inflação do Estilo de Vida.', 1),
(323, 81, 'O objetivo é substituir seu emprego principal na primeira semana; a armadilha é trabalhar pouco.', 0),
(324, 81, 'O objetivo é pagar apenas as dívidas de jogo; a armadilha é pedir demissão.', 0),

-- Alternativas da Questão 82 (IDs 325-328)
(325, 82, 'É aquela onde você investe dinheiro e recebe juros sem trabalhar.', 0),
(326, 82, 'É a troca de tempo por dinheiro, sendo limitada pelas horas do dia e com risco de burnout.', 1),
(327, 82, 'É a criação de infoprodutos que vendem enquanto você dorme.', 0),
(328, 82, 'É ilegal no Brasil se você já tiver um emprego formal.', 0),

-- Alternativas da Questão 83 (IDs 329-332)
(329, 83, 'O dinheiro cai na conta imediatamente, sem nenhum esforço ou trabalho inicial.', 0),
(330, 83, 'Ela permite vender o mesmo produto muitas vezes (escalabilidade), desvinculando ganho de tempo trabalhado.', 1),
(331, 83, 'Ela é garantida pelo governo federal, sendo mais segura que a poupança.', 0),
(332, 83, 'Ela não exige nenhum conhecimento técnico ou disciplina para começar.', 0),

-- Alternativas da Questão 84 (IDs 333-336)
(333, 84, 'Fazer manutenção de computadores cobrando por hora técnica.', 0),
(334, 84, 'Criar um plugin ou template de site que pode ser vendido múltiplas vezes.', 1),
(335, 84, 'Aceitar um segundo emprego com carteira assinada em outra empresa.', 0),
(336, 84, 'Dar aulas particulares de programação via videoconferência.', 0);

-- M3-L5

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 85
(85, 'M3-L5', 'O texto define o "perfil de investidor" como um conceito fundamental antes de começar a investir. O que essa definição leva em conta principalmente?', 1, 'O perfil de investidor é definido como o grau de intolerância ao risco (o quão seguro você se sente ao investir) somado ao seu nível de experiência no mercado financeiro.'),

-- Questão 86
(86, 'M3-L5', 'Quais são as características principais do perfil "Conservador" e para quem ele é geralmente recomendado?', 2, 'O perfil conservador busca segurança, estabilidade e baixa oscilação (previsibilidade). É altamente recomendado para iniciantes nos estudos de finanças que não querem perder dinheiro.'),

-- Questão 87
(87, 'M3-L5', 'O perfil "Moderado" é descrito como um ponto de equilíbrio. Como esse investidor costuma dividir seus investimentos?', 3, 'O moderado busca equilibrar risco e retorno. Ele geralmente aloca uma parte menor da renda em investimentos de maior risco (para buscar rentabilidade), mas mantém a maior parte em rendimentos seguros (para proteção).'),

-- Questão 88
(88, 'M3-L5', 'O investidor "Arrojado" (ou Agressivo) busca a máxima rentabilidade possível. Como ele lida com a volatilidade e qual é o seu horizonte de tempo ideal?', 4, 'O investidor arrojado aceita riscos elevados e entende a volatilidade (oscilação de preços) como o custo necessário para ter maiores retornos. Ele foca no longo ou longuíssimo prazo e não se abala com perdas momentâneas.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 85 (IDs 337-340)
(337, 85, 'A quantidade de dinheiro que você tem no banco e sua idade.', 0),
(338, 85, 'O grau de intolerância ao risco e o nível de experiência do investidor.', 1),
(339, 85, 'A profissão que você exerce e o seu salário mensal.', 0),
(340, 85, 'A capacidade de prever o futuro da bolsa de valores.', 0),

-- Alternativas da Questão 86 (IDs 341-344)
(341, 86, 'Busca altos riscos para ganhar rápido; recomendado para quem tem pouco dinheiro.', 0),
(342, 86, 'Busca segurança e estabilidade; recomendado para iniciantes que evitam perdas.', 1),
(343, 86, 'Busca investir apenas em criptomoedas; recomendado para jovens.', 0),
(344, 86, 'Busca equilíbrio total; recomendado para quem já é especialista.', 0),

-- Alternativas da Questão 87 (IDs 345-348)
(345, 87, 'Coloca 100% do dinheiro em ações voláteis para recuperar o tempo perdido.', 0),
(346, 87, 'Mantém todo o dinheiro na poupança e nunca arrisca nada.', 0),
(347, 87, 'Busca equilíbrio, investindo uma parte em risco e a maior parte em segurança.', 1),
(348, 87, 'Vende todos os bens para investir em uma única empresa.', 0),

-- Alternativas da Questão 88 (IDs 349-352)
(349, 88, 'Ele evita qualquer risco e saca o dinheiro assim que a bolsa cai.', 0),
(350, 88, 'Ele busca lucros imediatos (curto prazo) e não suporta ver o patrimônio oscilar.', 0),
(351, 88, 'Ele aceita alta volatilidade e riscos elevados visando retorno no longo prazo.', 1),
(352, 88, 'Ele investe apenas em renda fixa para garantir a aposentadoria.', 0);

-- M3-L6

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 89
(89, 'M3-L6', 'O texto alerta para um perigo comum ao receber o primeiro salário (e aumentos futuros), chamado de "Inflação do Estilo de Vida". O que isso significa?', 1, 'A Inflação do Estilo de Vida é a tendência de aumentar os gastos na mesma proporção que a renda aumenta (ganha mais, gasta mais), mantendo a pessoa sempre no "zero a zero" financeiro.'),

-- Questão 90
(90, 'M3-L6', 'Na regra 50/30/20 apresentada como plano de jogo, o que deve ser coberto pelo "Pote 1" (50% da renda)?', 2, 'O Pote 1, que deve ocupar no máximo 50% da renda líquida, é destinado aos Gastos Essenciais necessários para a sobrevivência, como aluguel, transporte, alimentação e contas básicas.'),

-- Questão 91
(91, 'M3-L6', 'O "Pote 3" (20%) é classificado como "Pagar-se Primeiro" e tem prioridade máxima. Qual deve ser o primeiro objetivo financeiro (urgente) a ser construído com esse dinheiro?', 3, 'O texto é claro: antes de pensar em ações, fundos ou bens de consumo, o objetivo urgente é iniciar a Reserva de Emergência (colchão de segurança) em investimentos seguros como Tesouro Selic ou CDB.'),

-- Questão 92
(92, 'M3-L6', 'Segundo a conclusão da lição, o que realmente separa um futuro financeiro tranquilo de uma vida de estresse, independentemente do valor do salário?', 4, 'O fator determinante não é o valor absoluto do salário, mas sim o HÁBITO de poupar (guardar uma parte) desde o primeiro pagamento. O texto enfatiza que o hábito é mais importante que a quantia inicial.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 89 (IDs 353-356)
(353, 89, 'É o aumento natural dos preços dos produtos no supermercado.', 0),
(354, 89, 'É a tendência de aumentar seus gastos na mesma proporção que sua renda aumenta.', 1),
(355, 89, 'É o ato de investir todo o salário em estilos de roupas caras.', 0),
(356, 89, 'É quando o governo cobra mais impostos sobre o primeiro salário.', 0),

-- Alternativas da Questão 90 (IDs 357-360)
(357, 90, 'Deve cobrir os gastos com lazer, festas e streaming.', 0),
(358, 90, 'Deve ser inteiramente investido na Bolsa de Valores.', 0),
(359, 90, 'Deve cobrir os gastos essenciais de sobrevivência (aluguel, comida, transporte).', 1),
(360, 90, 'Deve ser usado para pagar dívidas de cartão de crédito de terceiros.', 0),

-- Alternativas da Questão 91 (IDs 361-364)
(361, 91, 'Comprar um carro novo para ir trabalhar com mais conforto.', 0),
(362, 91, 'Investir em criptomoedas para tentar ficar rico rápido.', 0),
(363, 91, 'Iniciar a Reserva de Emergência em um investimento seguro.', 1),
(364, 91, 'Pagar uma viagem internacional para comemorar o primeiro emprego.', 0),

-- Alternativas da Questão 92 (IDs 365-368)
(365, 92, 'Ter a sorte de ganhar na loteria antes dos 30 anos.', 0),
(366, 92, 'Conseguir um emprego que pague R$ 10.000 logo no início da carreira.', 0),
(367, 92, 'O hábito de poupar (guardar uma parte) desde o primeiro salário.', 1),
(368, 92, 'Nunca gastar dinheiro com lazer e viver apenas para trabalhar.', 0);

-- M3-L7

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 93
(93, 'M3-L7', 'LCI e LCA são títulos de Renda Fixa emitidos por bancos. Qual é a diferença fundamental entre eles no que diz respeito ao destino do dinheiro investido?', 1, 'A diferença está no setor financiado: ao investir em uma LCI, o banco deve usar o recurso no setor Imobiliário. Ao investir em uma LCA, o recurso vai para o Agronegócio.'),

-- Questão 94
(94, 'M3-L7', 'O texto explica que o governo considera os setores Imobiliário e Agro estratégicos. Qual incentivo foi criado para estimular investimentos nessas áreas?', 2, 'O governo concedeu a isenção de Imposto de Renda (IR) para Pessoas Físicas nesses investimentos, tornando-os mais atrativos.'),

-- Questão 95
(95, 'M3-L7', 'Qual é a característica fiscal que torna as LCIs e LCAs conhecidas como as "queridinhas" dos investidores de Renda Fixa?', 3, 'A característica principal é a isenção de Imposto de Renda. Isso significa que a rentabilidade anunciada (bruta) é exatamente a que o investidor recebe (líquida).'),

-- Questão 96
(96, 'M3-L7', 'No exemplo comparativo, uma LCI pagando 95% do CDI foi considerada mais vantajosa que um CDB pagando 110% do CDI. Por que isso acontece matematicamente?', 4, 'Isso acontece porque o CDB sofre desconto de Imposto de Renda (no exemplo, 17,5%), o que reduz seu ganho líquido para cerca de 90,75% do CDI, ficando abaixo dos 95% líquidos da LCI.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 93 (IDs 369-372)
(369, 93, 'A LCI financia a compra de carros e a LCA financia a construção de estradas.', 0),
(370, 93, 'A LCI direciona recursos para o setor Imobiliário e a LCA para o Agronegócio.', 1),
(371, 93, 'Não há diferença, ambos os recursos vão para o caixa geral do governo.', 0),
(372, 93, 'A LCI é emitida por bancos públicos e a LCA apenas por bancos privados.', 0),

-- Alternativas da Questão 94 (IDs 373-376)
(373, 94, 'O governo garante rentabilidade mínima de 20% ao ano.', 0),
(374, 94, 'O governo permite que o investidor saque o dinheiro a qualquer hora sem carência.', 0),
(375, 94, 'O governo concedeu isenção de Imposto de Renda para Pessoas Físicas.', 1),
(376, 94, 'O governo paga um bônus extra em dinheiro para quem investir mais de R$ 100 mil.', 0),

-- Alternativas da Questão 95 (IDs 377-380)
(377, 95, 'Elas possuem a maior taxa de juros do mercado, superando a Bolsa de Valores.', 0),
(378, 95, 'Elas permitem deduzir o valor investido da declaração anual de imposto.', 0),
(379, 95, 'Elas são isentas de Imposto de Renda, garantindo rentabilidade líquida total.', 1),
(380, 95, 'Elas nunca sofrem com a inflação, tendo o valor corrigido diariamente.', 0),

-- Alternativas da Questão 96 (IDs 381-384)
(381, 96, 'Porque a LCI tem um bônus secreto que não aparece na taxa nominal.', 0),
(382, 96, 'Porque o imposto cobrado no CDB reduz seu ganho real, tornando-o inferior ao da LCI isenta.', 1),
(383, 96, 'Porque 95% é um número maior que 110% na matemática financeira.', 0),
(384, 96, 'Porque o CDB tem risco de crédito muito maior que a LCI.', 0);

-- M4-L1

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 97
(97, 'M4-L1', 'O texto compara um Fundo de Investimento a um "condomínio". O que essa analogia significa na prática para o investidor?', 1, 'Significa que diversos investidores juntam seu dinheiro em um "caixa" comum, e um profissional (o Gestor) é contratado para tomar as decisões de investimento seguindo uma estratégia.'),

-- Questão 98
(98, 'M4-L1', 'Os fundos cobram taxas pelo serviço de gestão. Qual é a condição específica para que a "Taxa de Performance" seja cobrada?', 2, 'A Taxa de Performance funciona como um "bônus" e só é cobrada quando o gestor consegue entregar um rendimento SUPERIOR ao esperado (acima do benchmark, como o Ibovespa ou CDI).'),

-- Questão 99
(99, 'M4-L1', 'O texto menciona um "sócio oculto" chamado "Come-Cotas". O que é esse mecanismo e como ele afeta o investidor?', 3, 'O Come-Cotas é uma antecipação obrigatória do Imposto de Renda que ocorre duas vezes por ano (maio e novembro). O governo "morde" parte das cotas, o que reduz o montante que estaria rendendo juros compostos.'),

-- Questão 100
(100, 'M4-L1', 'Na conclusão, o texto sugere que Fundos são uma boa porta de entrada, mas recomenda comparar seus custos com outra modalidade geralmente mais barata. Que modalidade é essa?', 4, 'O texto sugere a comparação com os ETFs (Exchange Traded Funds), que costumam ser mais baratos e eficientes que muitos fundos tradicionais.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 97 (IDs 385-388)
(385, 97, 'Significa que você compra um apartamento físico para alugar.', 0),
(386, 97, 'Significa que os investidores votam todo dia para decidir qual ação comprar.', 0),
(387, 97, 'Significa que o dinheiro é gerido por um profissional contratado (Gestor) em um caixa comum.', 1),
(388, 97, 'Significa que o síndico do seu prédio vai cuidar da sua conta bancária.', 0),

-- Alternativas da Questão 98 (IDs 389-392)
(389, 98, 'Ela é cobrada todo mês, independentemente do resultado do fundo.', 0),
(390, 98, 'Ela é cobrada apenas sobre o que render ACIMA do benchmark (o esperado).', 1),
(391, 98, 'Ela é cobrada quando o fundo tem prejuízo, para cobrir os custos.', 0),
(392, 98, 'Ela é um valor fixo de R$ 50,00 por ano.', 0),

-- Alternativas da Questão 99 (IDs 393-396)
(393, 99, 'É uma taxa que o banco cobra para imprimir os extratos.', 0),
(394, 99, 'É uma antecipação semestral de Imposto de Renda feita pelo governo.', 1),
(395, 99, 'É um bônus que o gestor paga para os cotistas mais antigos.', 0),
(396, 99, 'É o apelido dado aos investidores que sacam o dinheiro antes do prazo.', 0),

-- Alternativas da Questão 100 (IDs 397-400)
(397, 100, 'A Caderneta de Poupança.', 0),
(398, 100, 'Os Jogos de Loteria.', 0),
(399, 100, 'Os ETFs (Exchange Traded Funds).', 1),
(400, 100, 'O Cheque Especial.', 0);

-- M4-L2
INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 101
(101, 'M4-L2', 'O texto afirma que a diversificação é conhecida como o único "almoço grátis" do mercado. Qual é o principal objetivo dessa estratégia?', 1, 'O objetivo principal não é necessariamente aumentar o lucro imediato, mas reduzir drasticamente o risco de perda (proteger de desastres) sem sacrificar o potencial de retorno no longo prazo.'),

-- Questão 102
(102, 'M4-L2', 'No exemplo prático entre Bruno (concentrado) e Carla (diversificada), o que permitiu que Carla protegesse seu patrimônio mesmo com a queda de 80% em uma de suas ações?', 2, 'Carla dividiu seu dinheiro em empresas de SETORES diferentes. Assim, a perda catastrófica em uma ação foi compensada (anulada ou amenizada) pelos ganhos ou estabilidade das outras quatro.'),

-- Questão 103
(103, 'M4-L2', 'O texto diferencia dois tipos de risco. O que é o "Risco Específico" (Não-Sistêmico) e qual o efeito da diversificação sobre ele?', 3, 'Risco Específico é aquele ligado a uma única empresa (ex: fraude, má gestão). A diversificação serve justamente para ELIMINAR esse risco, tornando a falha de uma empresa estatisticamente irrelevante no todo.'),

-- Questão 104
(104, 'M4-L2', 'Existe um tipo de risco que, segundo a lição, a diversificação NÃO consegue eliminar. Que risco é esse?', 4, 'É o Risco de Mercado (Sistêmico), que envolve crises gerais (pandemias, guerras, recessão) que afetam a economia inteira. Se o sistema todo cai, todas as ações tendem a cair juntas, independentemente da diversificação.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 101 (IDs 401-404)
(401, 101, 'Garantir que o investidor fique rico em menos de um ano.', 0),
(402, 101, 'Reduzir drasticamente o risco de perda sem sacrificar o potencial de ganho.', 1),
(403, 101, 'Eliminar a necessidade de pagar Imposto de Renda.', 0),
(404, 101, 'Concentrar todo o dinheiro na empresa que paga mais dividendos.', 0),

-- Alternativas da Questão 102 (IDs 405-408)
(405, 102, 'Ela vendeu todas as ações antes da queda acontecer.', 0),
(406, 102, 'Ela investiu em 5 empresas de setores diferentes, compensando perdas com outros ganhos.', 1),
(407, 102, 'Ela processou a empresa que caiu para reaver o dinheiro.', 0),
(408, 102, 'Ela investiu apenas em Renda Fixa e fugiu da Bolsa.', 0),

-- Alternativas da Questão 103 (IDs 409-412)
(409, 103, 'É o risco de uma empresa específica falhar; a diversificação ELIMINA esse risco.', 1),
(410, 103, 'É o risco do governo aumentar os juros; a diversificação aumenta esse risco.', 0),
(411, 103, 'É o risco de uma pandemia global; a diversificação elimina esse risco.', 0),
(412, 103, 'É o risco de você esquecer a senha da corretora.', 0),

-- Alternativas da Questão 104 (IDs 413-416)
(413, 104, 'O Risco Específico (de uma empresa quebrar).', 0),
(414, 104, 'O Risco de Mercado (Sistêmico), como crises econômicas globais.', 1),
(415, 104, 'O Risco de ser hackeado na internet.', 0),
(416, 104, 'O Risco de escolher uma corretora ruim.', 0);

-- M4-L3

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 105
(105, 'M4-L3', 'O texto aborda um "bug mental" conhecido na Neurociência como Aversão à Perda. O que esse conceito diz sobre como nosso cérebro processa ganhos e perdas?', 1, 'Estudos mostram que a dor de perder dinheiro (ex: R$ 100) é sentida pelo cérebro com quase o dobro da intensidade do que o prazer de ganhar a mesma quantia, o que gera reações de pânico.'),

-- Questão 106
(106, 'M4-L3', 'No "Protocolo de Emergência" sugerido para momentos de pânico no mercado, qual é o "Passo 1" e por que ele é o mais importante?', 2, 'O Passo 1 é "NÃO FAZER NADA". A primeira atitude deve ser parar e se afastar do home broker para acalmar a Amígdala, pois decisões tomadas em pânico raramente são boas.'),

-- Questão 107
(107, 'M4-L3', 'No "Passo 3: O Algoritmo da Decisão", se você identificar que a queda é um Risco Sistêmico (o mercado todo caiu) e os fundamentos da sua empresa continuam bons, qual a ação lógica?', 3, 'Se a empresa continua boa e só caiu porque o mercado está em pânico, a ação lógica é SEGURAR (Hold) ou COMPRAR MAIS, aproveitando a "promoção" para comprar valor por um preço baixo.'),

-- Questão 108
(108, 'M4-L3', 'Como a "Diversificação" atua como uma vacina para proteger o investidor no "Cenário 2" (quando uma empresa específica quebra ou perde os fundamentos)?', 4, 'Se a carteira é diversificada, a empresa problemática representa apenas uma pequena fatia do patrimônio (ex: 5%). Assim, mesmo que ela caia 40%, o impacto no patrimônio total é mínimo, evitando o desastre financeiro.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 105 (IDs 417-420)
(417, 105, 'O cérebro ignora perdas financeiras e foca apenas nos ganhos futuros.', 0),
(418, 105, 'A dor de perder é quase duas vezes mais forte que o prazer de ganhar.', 1),
(419, 105, 'O prazer de ganhar é muito superior à dor de perder, incentivando apostas.', 0),
(420, 105, 'O cérebro processa ganhos e perdas exatamente da mesma forma lógica.', 0),

-- Alternativas da Questão 106 (IDs 421-424)
(421, 106, 'Vender tudo imediatamente para estancar o sangramento.', 0),
(422, 106, 'Comprar o máximo possível nos primeiros 5 minutos de queda.', 0),
(423, 106, 'Não fazer nada, respirar e se afastar para retomar a lógica.', 1),
(424, 106, 'Ligar para o gerente do banco para pedir conselhos.', 0),

-- Alternativas da Questão 107 (IDs 425-428)
(425, 107, 'Vender tudo, pois se o mercado está caindo, a empresa vai falir.', 0),
(426, 107, 'Segurar ou Comprar Mais, pois é uma oportunidade de pagar barato por uma empresa boa.', 1),
(427, 107, 'Vender apenas metade para garantir algum dinheiro.', 0),
(428, 107, 'Processar a bolsa de valores pela queda dos preços.', 0),

-- Alternativas da Questão 108 (IDs 429-432)
(429, 108, 'Ela garante que nenhuma ação da carteira jamais cairá de preço.', 0),
(430, 108, 'Ela faz com que o governo cubra os prejuízos de empresas específicas.', 0),
(431, 108, 'Ela permite que o investidor processe a empresa por má gestão.', 0),
(432, 108, 'Ela limita o impacto da queda, pois a empresa representa uma parte pequena do total.', 1);

-- M4-L4

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 109
(109, 'M4-L4', 'O texto introduz o conceito de "Risco-Brasil" como um perigo para quem investe apenas localmente. O que define esse risco?', 1, 'Risco-Brasil é o risco de ter todo o patrimônio "amarrado" a um único país. Se a economia, inflação ou política do Brasil forem mal, todo o seu dinheiro sofre junto.'),

-- Questão 110
(110, 'M4-L4', 'Ao investir em ETFs Internacionais pela B3 (como o IVVB11), de que forma o valor do seu investimento varia?', 2, 'O valor varia de acordo com dois fatores: 1) A variação das ações no exterior (S&P 500) e 2) A variação do Dólar. Se o Dólar sobe frente ao Real, sua cota tende a valorizar também.'),

-- Questão 111
(111, 'M4-L4', 'O que são os BDRs (Brazilian Depositary Receipts) e qual a sua principal função para o investidor brasileiro?', 3, 'BDRs são "recibos" negociados na B3 lastreados em ações estrangeiras. Eles permitem investir em empresas específicas (como Apple ou Coca-Cola) e receber dividendos em Reais, sem sair da corretora brasileira.'),

-- Questão 112
(112, 'M4-L4', 'Qual é a principal vantagem da "Forma 2" (Investidor Global - abrir conta no exterior) em comparação com a "Forma 1" (Investir via B3)?', 4, 'A principal vantagem é a diversificação de jurisdição e moeda. O dinheiro está fisicamente em outro país (em Dólar), protegido pelas leis estrangeiras e não está sob o risco direto do sistema financeiro brasileiro.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 109 (IDs 433-436)
(433, 109, 'É o risco de investir apenas em empresas estatais brasileiras.', 0),
(434, 109, 'É o risco de ter todo o patrimônio atrelado à economia e política de um único país.', 1),
(435, 109, 'É a taxa de juros que os bancos cobram para enviar dinheiro para fora.', 0),
(436, 109, 'É a proibição legal de brasileiros investirem em moeda estrangeira.', 0),

-- Alternativas da Questão 110 (IDs 437-440)
(437, 110, 'Varia apenas de acordo com a inflação brasileira.', 0),
(438, 110, 'Varia de acordo com a valorização das ações lá fora e a variação do Dólar.', 1),
(439, 110, 'É um investimento de renda fixa com retorno garantido em dólar.', 0),
(440, 110, 'O valor é fixo e só muda se o governo americano aumentar os juros.', 0),

-- Alternativas da Questão 111 (IDs 441-444)
(441, 111, 'São ações de empresas brasileiras que exportam produtos para o exterior.', 0),
(442, 111, 'São títulos da dívida pública dos Estados Unidos.', 0),
(443, 111, 'São recibos negociados no Brasil lastreados em ações estrangeiras.', 1),
(444, 111, 'São fundos imobiliários que investem apenas em hotéis internacionais.', 0),

-- Alternativas da Questão 112 (IDs 445-448)
(445, 112, 'Não há vantagem, pois as taxas no exterior são sempre maiores.', 0),
(446, 112, 'O dinheiro fica fisicamente em Dólar e sob outra jurisdição, protegendo contra o risco local.', 1),
(447, 112, 'A única vantagem é poder viajar para o exterior sem passaporte.', 0),
(448, 112, 'A isenção total de impostos, já que não é preciso declarar nada à Receita Federal.', 0);

-- M4-L5
INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 113
(113, 'M4-L5', 'O texto define a Blockchain como a tecnologia-chave por trás das criptomoedas. Quais são as três características principais desse "livro-caixa" digital citadas na lição?', 1, 'A Blockchain é descrita como Pública (visível a todos), Imutável (não pode ser apagada ou alterada após o registro) e Descentralizada (não possui um dono ou banco central).'),

-- Questão 114
(114, 'M4-L5', 'Enquanto o Bitcoin é comparado ao "Ouro Digital" pela sua escassez, qual é a principal função do Ethereum (ETH) destacada no texto?', 2, 'O Ethereum é descrito como o "Computador Mundial", servindo de plataforma para rodar "Smart Contracts" (Contratos Inteligentes) e Aplicações Descentralizadas, indo muito além de apenas uma moeda.'),

-- Questão 115
(115, 'M4-L5', 'Criptomoedas são classificadas como um investimento "assimétrico" de alto risco. Qual é a "Regra de Ouro" apresentada para quem deseja investir nessa classe?', 3, 'A regra é clara: NUNCA invista dinheiro que você não pode perder (como o da Reserva de Emergência), pois existe o risco real do ativo perder 100% do valor (ir a zero).'),

-- Questão 116
(116, 'M4-L5', 'Para o investidor iniciante que deseja exposição a cripto de forma simples, regulamentada e via Bolsa brasileira (B3), qual é o caminho sugerido?', 4, 'O texto sugere o investimento via ETFs de Criptomoedas (como HASH11 ou QBTC11), que permitem investir pela corretora tradicional sem a complexidade de gerenciar carteiras digitais.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 113 (IDs 449-452)
(449, 113, 'Privada, Temporária e Centralizada no Banco Central.', 0),
(450, 113, 'Pública, Imutável e Descentralizada.', 1),
(451, 113, 'Secreta, Flexível e Governamental.', 0),
(452, 113, 'Anônima, Editável e Controlada por Bancos.', 0),

-- Alternativas da Questão 114 (IDs 453-456)
(453, 114, 'Servir apenas como meio de pagamento para compras ilegais.', 0),
(454, 114, 'Ser uma plataforma para Contratos Inteligentes (Smart Contracts) e aplicações descentralizadas.', 1),
(455, 114, 'Substituir o dólar físico em todas as transações mundiais até 2030.', 0),
(456, 114, 'Garantir rentabilidade fixa de 10% ao mês para os investidores.', 0),

-- Alternativas da Questão 115 (IDs 457-460)
(457, 115, 'Vender bens físicos (como carro ou casa) para comprar tudo em Bitcoin.', 0),
(458, 115, 'Usar a Reserva de Emergência, pois o retorno é garantido.', 0),
(459, 115, 'Nunca investir dinheiro que não pode perder, alocando uma parte minúscula da carteira.', 1),
(460, 115, 'Investir apenas quando o preço estiver na máxima histórica.', 0),

-- Alternativas da Questão 116 (IDs 461-464)
(461, 116, 'Enviar dinheiro via PIX para "agentes de investimento" no WhatsApp.', 0),
(462, 116, 'Comprar máquinas de mineração para imprimir Bitcoin em casa.', 0),
(463, 116, 'Investir através de ETFs negociados na B3 (como HASH11).', 1),
(464, 116, 'Viajar para El Salvador para abrir uma conta bancária presencialmente.', 0);

-- M4-L6

INSERT IGNORE INTO questions (id, lesson_id, statement, `order`, explanation)
VALUES
-- Questão 117
(117, 'M4-L6', 'O texto cita três razões principais para não depender exclusivamente do INSS para a aposentadoria. Qual é a limitação descrita sobre a natureza da previdência social?', 1, 'O texto explica que o INSS foi desenhado para ser um "piso" de segurança, e não para manter o padrão de vida. O valor recebido provavelmente será menor que o salário da ativa.'),

-- Questão 118
(118, 'M4-L6', 'Para calcular o "Número Mágico" necessário para a independência financeira, a lição apresenta a "Regra dos 300 Meses". Como é feito esse cálculo?', 2, 'A regra consiste em pegar o seu Custo de Vida Mensal ideal na aposentadoria e multiplicar por 300. O resultado é o montante necessário para viver retirando 4% ao ano.'),

-- Questão 119
(119, 'M4-L6', 'Entre os veículos de investimento citados, por que o Tesouro IPCA+ é destacado como o "Garantidor" para a aposentadoria?', 3, 'Porque ele paga uma taxa fixa somada à variação da inflação (IPCA). Isso garante matematicamente que o dinheiro terá um Ganho Real e não perderá poder de compra ao longo das décadas.'),

-- Questão 120
(120, 'M4-L6', 'Ao decidir entre os planos de Previdência Privada PGBL e VGBL, qual é o principal critério de escolha apontado no texto?', 4, 'O critério é o tipo de declaração de Imposto de Renda. O PGBL é recomendado para quem faz a declaração Completa (pois abate impostos hoje), enquanto o VGBL é para quem faz a declaração Simplificada.');

INSERT IGNORE INTO alternatives (id, question_id, text, is_correct)
VALUES
-- Alternativas da Questão 117 (IDs 465-468)
(465, 117, 'O INSS garante que você receberá o dobro do seu último salário.', 0),
(466, 117, 'O INSS foi desenhado como um piso de segurança, não para manter o padrão de vida.', 1),
(467, 117, 'O INSS é imune à inflação e sempre paga acima do custo de vida.', 0),
(468, 117, 'O INSS só paga benefícios para quem trabalhou em empresas estatais.', 0),

-- Alternativas da Questão 118 (IDs 469-472)
(469, 118, 'Soma-se todas as dívidas atuais e multiplica por 10.', 0),
(470, 118, 'Multiplica-se o Custo de Vida Mensal ideal por 300.', 1),
(471, 118, 'Divide-se a idade atual por 65 (idade de aposentadoria).', 0),
(472, 118, 'Multiplica-se o salário atual por 12 meses.', 0),

-- Alternativas da Questão 119 (IDs 473-476)
(473, 119, 'Porque ele é isento de qualquer imposto, assim como a poupança.', 0),
(474, 119, 'Porque ele garante ganho real acima da inflação, protegendo o poder de compra.', 1),
(475, 119, 'Porque ele permite sacar o dinheiro a qualquer momento sem perdas.', 0),
(476, 119, 'Porque ele investe automaticamente na bolsa de valores americana.', 0),

-- Alternativas da Questão 120 (IDs 477-480)
(477, 120, 'O PGBL é para quem ganha menos de um salário mínimo.', 0),
(478, 120, 'O VGBL é o único que permite resgate antes de 60 anos.', 0),
(479, 120, 'O PGBL é recomendado para declaração Completa do IR; o VGBL para a Simplificada.', 1),
(480, 120, 'Não há diferença prática, a escolha é apenas estética.', 0);

-- ============================================================================
-- 7. MISSÕES
-- ============================================================================
INSERT IGNORE INTO missions (id, title, description, reward_fin_points, category, trigger_event_type, target_count) VALUES
('MISSION_COMPLETE_1_LESSON', 'Primeira Lição', 'Complete sua primeira lição e comece sua jornada financeira!', 10, 'LEARNING', 'LESSON_COMPLETED', 1),
('MISSION_COMPLETE_5_LESSONS', 'Aprendiz', 'Complete 5 lições e demonstre seu comprometimento.', 50, 'LEARNING', 'LESSON_COMPLETED', 5),
('MISSION_COMPLETE_10_LESSONS', 'Estudioso', 'Complete 10 lições e torne-se um estudante dedicado.', 100, 'LEARNING', 'LESSON_COMPLETED', 10),
('MISSION_COMPLETE_20_LESSONS', 'Expert Financeiro', 'Complete 20 lições e alcance o nível de especialista!', 250, 'LEARNING', 'LESSON_COMPLETED', 20),
('MISSION_CREATE_1_TRANSACTION', 'Primeiro Registro', 'Adicione sua primeira transação e comece a controlar suas finanças.', 15, 'BUDGET', 'TRANSACTION_CREATED', 1),
('MISSION_CREATE_5_TRANSACTIONS', 'Organizador', 'Registre 5 transações e mantenha seu orçamento atualizado.', 75, 'BUDGET', 'TRANSACTION_CREATED', 5),
('MISSION_CREATE_20_TRANSACTIONS', 'Mestre do Orçamento', 'Registre 20 transações e domine o controle financeiro!', 200, 'BUDGET', 'TRANSACTION_CREATED', 20),
('MISSION_CREATE_1_GOAL', 'Primeira Meta', 'Defina sua primeira meta financeira e planeje seu futuro.', 20, 'GOALS', 'GOAL_COMPLETED', 1),
('MISSION_CREATE_3_GOALS', 'Planejador', 'Crie 3 metas e construa seu plano financeiro completo.', 100, 'GOALS', 'GOAL_COMPLETED', 3);

-- ============================================================================
-- 8. BADGES
-- ============================================================================
INSERT IGNORE INTO achievement (id, title, icon, required_level) VALUES
(1, 'Primeiro Passo', '🎯', 2),
(2, 'Aprendiz Dedicado', '📚', 5),
(3, 'Estudante Aplicado', '🎓', 10),
(4, 'Expert Financeiro', '💎', 15),
(5, 'Organizador', '💰', 20),
(6, 'Mestre do Orçamento', '📊', 25),
(7, 'Planejador', '🎯', 30),
(8, 'Visionário', '🚀', 35);

-- ============================================================================
-- 9. COMMUNITY DATA
-- ============================================================================

-- Posts de exemplo
INSERT IGNORE INTO posts (id, author_id, type, category, content, status, reaction_count, comment_count, share_count, created_at, updated_at)
VALUES
(1, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'TEXT', 'DICAS', 
'🎯 Dica do dia: Comece pequeno! Não precisa investir R$ 1.000 de uma vez. Comece com R$ 50 ou R$ 100 e vá aumentando gradualmente. O importante é criar o hábito de investir todo mês.', 
'ACTIVE', 0, 0, 0, NOW(), NOW()),

(2, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'ACHIEVEMENT', 'CONQUISTAS', 
'🏆 Acabei de completar o módulo "Primeiros Passos no Mundo das Finanças"! Agora entendo melhor sobre inflação, Taxa Selic e juros compostos. Que jornada incrível! #educacaofinanceira #finquest', 
'ACTIVE', 0, 0, 0, NOW(), NOW()),

(3, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'TIP', 'DICAS', 
'💡 Você sabia? O Tesouro Selic rende TODOS OS DIAS úteis, enquanto a poupança só rende uma vez por mês no aniversário. Essa é uma das razões pela qual ele é melhor para sua Reserva de Emergência!', 
'ACTIVE', 0, 0, 0, NOW(), NOW()),

(4, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'QUESTION', 'PERGUNTAS', 
'❓ Dúvida: Vocês acham melhor começar investindo em Tesouro Direto ou em CDBs de bancos médios? Tenho R$ 500 para começar minha reserva de emergência. Qual a opinião de vocês?', 
'ACTIVE', 0, 0, 0, NOW(), NOW()),

(5, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'STORY', 'HISTORIAS', 
'📖 Minha história: Há 6 meses eu estava no vermelho, com dívidas no cartão e sem saber para onde o dinheiro ia. Depois de começar a usar o FinQuest e aplicar os conceitos dos 3 Pilares, consegui quitar minhas dívidas e já tenho R$ 2.000 de reserva de emergência! Se eu consegui, você também consegue! 💪', 
'ACTIVE', 0, 0, 0, NOW(), NOW()),

(6, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 'TEXT', 'METAS', 
'🎯 Definindo minhas metas para 2026: 1) Aumentar minha reserva para R$ 10.000. 2) Começar a investir na Bolsa com 10% da renda. 3) Completar todos os módulos do FinQuest. Vamos juntos nessa jornada! #metas2026 #planejamento', 
'ACTIVE', 0, 0, 0, NOW(), NOW());

-- Comentários de exemplo
INSERT IGNORE INTO comments (id, post_id, author_id, content, marked_as_useful, reaction_count, created_at, updated_at)
VALUES
(1, 1, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 
'Excelente dica! Eu comecei com apenas R$ 30 por mês e hoje já consigo investir R$ 300. O hábito é mais importante que o valor inicial!', 
false, 0, NOW(), NOW()),

(2, 4, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 
'Para reserva de emergência, o Tesouro Selic é mais indicado pela liquidez diária e segurança máxima. CDBs são bons também, mas verifique se tem liquidez diária e se o banco tem boa classificação de risco.', 
false, 0, NOW(), NOW()),

(3, 5, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 
'Que história inspiradora! Parabéns pela disciplina e pela virada financeira. Você é um exemplo para todos nós! 👏', 
false, 0, NOW(), NOW());

-- Replies (comentários aninhados)
INSERT IGNORE INTO comments (id, post_id, author_id, parent_id, content, marked_as_useful, reaction_count, created_at, updated_at)
VALUES
(4, 1, 'DPMqU5vYQ1Xsq5nIugHyfJYjp512', 1, 
'Concordo totalmente! O importante é não desanimar e manter a consistência. Pequenos passos somam grandes conquistas!', 
false, 0, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
