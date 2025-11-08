// src/pages/LessonPage.tsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm'; // Para pegar o ID da lição/curso
// Exemplo de importação de conteúdo Markdown

// Importe seus componentes estilizados
import {
  LessonTitle,
  LessonParagraph,
  LessonHighlight,
  LessonListItem,
  LessonStrong,
  HighlightBox,
  TableContainer, // Nosso novo wrapper
  StyledTable,
  StyledTh,
  StyledTd
} from '../pages/Typography.styles'; // Ajuste o caminho
import { Title } from './OnboardingPage.style';

// Simulação de conteúdo Markdown que viria da sua API/Banco de Dados


const lessonsModules = import.meta.glob('../lessons/*.md', { as: 'raw', eager: true });
const LessonPage = () => {
  //const { courseId, lessonId } = useParams(); // Pega IDs da URL, se necessário
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const courseId = 1;
  const lessonId = 5;

  // Simula a busca do conteúdo da lição
  useEffect(() => {
    
    const filePath = `../lessons/${courseId}-${lessonId}.md`;

    const content = lessonsModules[filePath];

    if (content) {
        setLessonContent(content);
    }else{
        console.error("Lição não encontrada.");
        setLessonContent("Lição não encontrada.");
    }

    setIsLoading(false);
    console.log(`Buscando conteúdo para curso ${courseId}, lição ${lessonId}...`);

    // --- Em um app real, faria a chamada fetch para sua API aqui ---
    // fetch(`/api/courses/${courseId}/lessons/${lessonId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //      setLessonContent(data.markdownContent); // Supondo que a API retorna um campo 'markdownContent'
    //      setIsLoading(false);
    //   })
    //   .catch(error => {
    //      console.error("Erro ao buscar lição:", error);
    //      setLessonContent("Erro ao carregar o conteúdo da lição.");
    //      setIsLoading(false);
    //   });

     // Limpa o timeout se o componente desmontar
  }, []); // Re-busca se o ID da lição/curso mudar

  if (isLoading) {
    return <div>Carregando conteúdo da lição...</div>; // Ou um componente Spinner
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      {/* Container principal da página */}

      {/* Renderiza o conteúdo Markdown usando ReactMarkdown */}
      <ReactMarkdown
        // A prop 'components' faz a mágica do mapeamento
        remarkPlugins={[remarkGfm]}
        components={{
          // Tag Markdown -> Seu Componente React Estilizado
          h1: ({node, ...props}) => <Title {...props} />,
          h2: ({node, ...props}) => <LessonTitle {...props} />,
          h3: ({node, ...props}) => <h3 style={{marginTop: '1.5rem', marginBottom:'0.5rem'}} {...props} />, // Exemplo: Estilo inline ou criar componente H3
          p: ({node, ...props}) => <LessonParagraph {...props} />,
          blockquote: ({node, ...props}) => <LessonHighlight {...props} />,
          li: ({node, ...props}) => <LessonListItem {...props} />,
          strong: ({node, ...props}) => <LessonStrong {...props} />,
          div: ({node, ...props}) => <HighlightBox {...props} />,
          // Adicione mapeamentos para outras tags conforme necessário (ul, ol, a, etc.)
          table: ({node, ...props}) => (
          <TableContainer> 
            <StyledTable {...props} /> 
          </TableContainer>
        ),
        th: ({node, ...props}) => <StyledTh {...props} />,
        td: ({node, ...props}) => <StyledTd {...props} />,
        }}
      >
        {lessonContent}
      </ReactMarkdown>

      {/* Aqui você adicionaria o componente do Quiz no final */}
      {/* <Quiz lessonId={lessonId} /> */}
      <hr style={{margin: '2rem 0'}}/>
      <button>Próxima Lição / Concluir Curso</button>
    </div>
  );
};

export default LessonPage;