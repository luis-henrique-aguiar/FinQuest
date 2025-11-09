import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "react-feather";
import { useToast } from "../hooks/useToast";
import {
  getLessonDetails,
  type LessonDetailsDTO,
} from "../services/lessonService";
import Button from "../components/common/Button";
import * as S from "./LessonPage.styles";
import { LessonQuiz, type QuizQuestion } from '../components/gamification/LessonQuiz';

const MOCK_QUIZ_DATA: QuizQuestion[] = [
  {
    question: "O que são Juros Compostos?",
    options: [
      { letter: "A", text: "Juros pagos apenas sobre o valor principal investido." },
      { letter: "B", text: "Juros ganhos sobre o valor principal e também sobre os juros já acumulados." },
      { letter: "C", text: "Um imposto que o governo cobra sobre investimentos." },
    ],
    correctAnswer: "B",
    explanation: "Correto! Juros compostos são 'juros sobre juros', o que permite um crescimento exponencial do seu dinheiro ao longo do tempo."
  },
  {
    question: "Qual o fator mais importante para o poder dos juros compostos?",
    options: [
      { letter: "A", text: "O valor inicial investido." },
      { letter: "B", text: "A taxa de juros diária." },
      { letter: "C", text: "O Tempo." },
    ],
    correctAnswer: "C",
    explanation: "O Tempo é o ingrediente mais poderoso! Quanto mais tempo seu dinheiro fica investido, mais os 'juros sobre juros' podem trabalhar a seu favor."
  },
  {
    question: "Na regra 50/30/20, o que os 20% representam?",
    options: [
      { letter: "A", text: "Gastos essenciais (moradia, contas)." },
      { letter: "B", text: "Desejos pessoais (lazer, compras)." },
      { letter: "C", text: "Poupança e pagamento de dívidas." },
    ],
    correctAnswer: "C",
    explanation: "Exato! A regra sugere 50% para necessidades, 30% para desejos, e 20% para seus objetivos financeiros (poupar, investir ou pagar dívidas)."
  }
];


const LessonPage = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const [lessonDetails, setLessonDetails] = useState<LessonDetailsDTO | null>(
    null
  );
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId || !lessonId) {
      addToast("Erro: ID do curso ou lição não encontrado.", "error");
      navigate("/learn");
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const detailsPromise = getLessonDetails(lessonId);
        const filePath = `/lessons/${lessonId}.md`;
        const contentPromise = fetch(filePath).then((res) => {
          if (!res.ok) throw new Error(`Lição não encontrada em ${filePath}`);
          return res.text();
        });

        const [detailsData, contentData] = await Promise.all([
          detailsPromise,
          contentPromise,
        ]);

        setLessonDetails(detailsData);
        setLessonContent(contentData);

        const wordCount = contentData.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        setReadingTime(minutes);
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

  const handleNextLesson = () => {
    if (lessonDetails?.nextLessonId) {
      navigate(`/learn/${courseId}/${lessonDetails.nextLessonId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      addToast("Parabéns, você concluiu o curso!", "success");
      navigate(`/learn/${courseId}`);
    }
  };

  const handlePreviousLesson = () => {
    if (lessonDetails?.previousLessonId) {
      navigate(`/learn/${courseId}/${lessonDetails.previousLessonId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(`/learn/${courseId}`);
    }
  };

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz finalizado! Pontuação: ${score}`);
    addToast(`Você acertou ${score} de ${MOCK_QUIZ_DATA.length} questões!`, "success");
  };

  if (isLoading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando conteúdo da lição...</p>
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.Header>
        <S.HeaderContent>
          <S.BackButton
            onClick={() => navigate(`/learn/${courseId}`)}
            aria-label="Voltar para o curso"
          >
            <ArrowLeft size={20} />
          </S.BackButton>
          <S.HeaderTitle>
            {lessonDetails?.title || "Carregando..."}
          </S.HeaderTitle>
        </S.HeaderContent>
      </S.Header>

      <S.ContentWrapper>
        <S.LessonMeta>
          <div className="meta-item">
            <BookOpen size={16} />
            <span>Educação Financeira</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{readingTime} min de leitura</span>
          </div>
        </S.LessonMeta>

        <S.ContentCard>
          <S.StyledMarkdown>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                div: ({ node, ...props }) => <S.HighlightBox {...props} />,
              }}
            >
              {lessonContent!}
            </ReactMarkdown>
          </S.StyledMarkdown>
        </S.ContentCard>
      </S.ContentWrapper>

      <S.QuizContainer>
        <LessonQuiz 
          questions={MOCK_QUIZ_DATA} 
          onComplete={handleQuizComplete} 
        />
      </S.QuizContainer>

      <S.FooterNavigation>
        <Button
          variant="outline"
          onClick={handlePreviousLesson}
          icon={<ArrowLeft size={16} />}
        >
          {lessonDetails?.previousLessonId
            ? "Lição Anterior"
            : "Voltar ao Curso"}
        </Button>

        <Button
          variant="primary"
          onClick={handleNextLesson}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          {lessonDetails?.nextLessonId ? "Próxima Lição" : "Concluir Curso"}
        </Button>
      </S.FooterNavigation>
    </S.PageContainer>
  );
};

export default LessonPage;
