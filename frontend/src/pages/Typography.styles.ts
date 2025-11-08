// src/components/common/Typography.styles.ts (ou onde preferir)
import styled from 'styled-components';


export const LessonTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

export const LessonParagraph = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;


export const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SectionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0;
`;

export const HighlightBox = styled.div`
  background-color: ${({ theme }) =>
    theme.colors.background}; // Cor de fundo do app
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.md} 0;
  border-radius: 0 ${({ theme }) => theme.borderRadius.medium}
    ${({ theme }) => theme.borderRadius.medium} 0;

  /* Se o LessonParagraph já não tiver margem, 
    esta regra 'p' pode ser necessária.
    O IMPORTANTE é remover o 'font-style: italic'.
  */
  p {
    margin: 0; 
    /* font-style: italic;  <-- REMOVA ESTA LINHA */
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const LessonHighlight = styled.blockquote`
  background-color: ${({ theme }) => theme.colors.primary}1A; /* Fundo primário com transparência */
  border-left: 5px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  p { /* Estiliza parágrafos dentro da citação */
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    margin-bottom: 0; /* Remove margem do último parágrafo */
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto; // Permite rolar a tabela se ela for muito larga
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd; // Borda sutil ao redor
  border-radius: 8px;
`;

// 2. A tag <table> em si
export const StyledTable = styled.table`
  width: 100%; // Ocupa todo o espaço do contêiner
  border-collapse: collapse; // Junta as bordas das células
  font-size: 1rem;
`;

// 3. Células do Cabeçalho (<th>)
export const StyledTh = styled.th`
  background-color: #f4f4f4; // Um cinza claro para o cabeçalho
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  text-align: left; // Alinhar à esquerda (como no seu exemplo de IR)
  font-weight: 600;
  color: #333;
`;

// 4. Células de Dados (<td>)
export const StyledTd = styled.td`
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  line-height: 1.5;

  // Estilo "zebrado" (striped) para melhor leitura
  tr:nth-child(even) & {
    background-color: #f9f9f9;
  }
`;

//Adicione outros mapeamentos conforme necessário (listas, links, etc.)
export const LessonListItem = styled.li`
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    margin-left: ${({ theme }) => theme.spacing.lg}; /* Para indentação */
`;

export const LessonStrong = styled.strong`
    color: ${({ theme }) => theme.colors.secondary}; /* Exemplo: destacar em verde */
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;