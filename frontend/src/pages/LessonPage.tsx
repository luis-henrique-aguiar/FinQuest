import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import {
  LessonTitle,
  LessonParagraph,
  LessonHighlight,
  LessonListItem,
  LessonStrong,
  HighlightBox,
  TableContainer,
  StyledTable,
  StyledTh,
  StyledTd,
} from "../pages/Typography.styles";
import { Title } from "./OnboardingPage.style";
import { useToast } from "../hooks/useToast";
import styled from "styled-components";
import { ArrowLeft } from "react-feather";
import {
  getLessonDetails,
  type LessonDetailsDTO,
} from "../services/lessonService";
import Button from "../components/common/Button";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    transform: scale(1.1);
  }
`;

const FooterNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.white};
`;

const LessonPage = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  // Estados para os dois fetches
  const [lessonDetails, setLessonDetails] = useState<LessonDetailsDTO | null>(
    null
  );
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addToast } = useToast();
  const navigate = useNavigate();

  // 2. useEffect atualizado para buscar ambos
  useEffect(() => {
    if (!courseId || !lessonId) {
      addToast("Erro: ID do curso ou lição não encontrado.", "error");
      navigate("/learn");
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Promessa 1: Buscar os detalhes (próxima/anterior) da API
        const detailsPromise = getLessonDetails(lessonId);

        // Promessa 2: Buscar o conteúdo Markdown da pasta /public
        const filePath = `/lessons/${lessonId}.md`;
        const contentPromise = fetch(filePath).then((res) => {
          if (!res.ok) throw new Error(`Lição não encontrada em ${filePath}`);
          return res.text();
        });

        // 3. Espera as duas promessas terminarem
        const [detailsData, contentData] = await Promise.all([
          detailsPromise,
          contentPromise,
        ]);

        setLessonDetails(detailsData);
        setLessonContent(contentData);
      } catch (error) {
        console.error("Erro ao carregar conteúdo da lição:", error);
        setLessonContent(
          "# ❌ Lição Não Encontrada\n\nNão foi possível carregar o conteúdo desta lição."
        );
        addToast("Erro ao carregar a lição.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [courseId, lessonId, addToast, navigate]);

  if (isLoading) {
    return <div>Carregando conteúdo da lição...</div>;
  }

  // 4. Lógica de Navegação dos Botões
  const handleNextLesson = () => {
    if (lessonDetails?.nextLessonId) {
      // Navega para a próxima lição
      navigate(`/learn/${courseId}/${lessonDetails.nextLessonId}`);
    } else {
      // É a última lição, navega de volta para a página do curso
      addToast("Parabéns, você concluiu o curso!", "success");
      navigate(`/learn/${courseId}`);
    }
  };

  const handlePreviousLesson = () => {
    if (lessonDetails?.previousLessonId) {
      // Navega para a lição anterior
      navigate(`/learn/${courseId}/${lessonDetails.previousLessonId}`);
    } else {
      // É a primeira lição, navega de volta para a página do curso
      navigate(`/learn/${courseId}`);
    }
  };

  return (
    <PageContainer>
      <Header>
        {/* 5. Botão "Voltar" (para a página do curso) */}
        <BackButton
          onClick={() => navigate(`/learn/${courseId}`)}
          aria-label="Voltar para o curso"
        >
          <ArrowLeft size={20} />
        </BackButton>
        {/* Usamos o LessonTitle para o título principal da lição */}
        <LessonTitle style={{ margin: 0 }}>
          {lessonDetails?.title || "Carregando..."}
        </LessonTitle>
      </Header>
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <Title {...props} />,
            h2: ({ node, ...props }) => <LessonTitle {...props} />,
            h3: ({ node, ...props }) => (
              <h3
                style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}
                {...props}
              />
            ),
            p: ({ node, ...props }) => <LessonParagraph {...props} />,
            blockquote: ({ node, ...props }) => <LessonHighlight {...props} />,
            li: ({ node, ...props }) => <LessonListItem {...props} />,
            strong: ({ node, ...props }) => <LessonStrong {...props} />,
            div: ({ node, ...props }) => <HighlightBox {...props} />,
            table: ({ node, ...props }) => (
              <TableContainer>
                <StyledTable {...props} />
              </TableContainer>
            ),
            th: ({ node, ...props }) => <StyledTh {...props} />,
            td: ({ node, ...props }) => <StyledTd {...props} />,
          }}
        >
          {lessonContent!}
        </ReactMarkdown>
      </div>
      <FooterNavigation>
        <Button
          variant="outline"
          onClick={handlePreviousLesson}
          icon={<ArrowLeft size={16} />}
        >
          {lessonDetails?.previousLessonId
            ? "Lição Anterior"
            : "Voltar ao Curso"}
        </Button>

        <Button variant="primary" onClick={handleNextLesson}>
          {lessonDetails?.nextLessonId ? "Próxima Lição" : "Concluir Curso"}
        </Button>
      </FooterNavigation>
    </PageContainer>
  );
};

export default LessonPage;
