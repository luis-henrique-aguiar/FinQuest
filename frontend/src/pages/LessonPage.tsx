import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "react-feather";
import { useToast } from "../hooks/useToast";
import {
  completeLesson,
  getLessonDetails,
  getLessonQuiz,
  type LessonDetailsDTO,
} from "../services/lessonService";
import Button from "../components/common/Button";
import * as S from "./LessonPage.styles";
import {
  LessonQuiz,
  type QuizQuestion,
} from "../components/gamification/LessonQuiz";
import { useAuth } from "../hooks/useAuth";
import { useGamification } from "../context/GamificationContext";

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
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { updateUserContext } = useAuth();
  const { showLevelUp, showBadgeUnlocked } = useGamification();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

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

        const quizPromise = getLessonQuiz(lessonId);

        const [detailsData, contentData, quizData] = await Promise.all([
          detailsPromise,
          contentPromise,
          quizPromise,
        ]);

        setLessonDetails(detailsData);
        setLessonContent(contentData);
        setQuizQuestions(quizData);

        const wordCount = contentData.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        setReadingTime(minutes);
      } catch (error: any) {
        console.error("Erro ao carregar conteúdo da lição:", error);
        if (error.config?.url?.includes("/quiz")) {
          console.log(
            "Nenhum quiz encontrado para esta lição. Carregando sem quiz."
          );
          setLessonContent(
            "# ❌ Erro ao Carregar\n\nNão foi possível carregar o conteúdo ou o quiz desta lição."
          );
          addToast("Erro ao carregar a lição.", "error");
        } else {
          setLessonContent(
            "# ❌ Lição Não Encontrada\n\nNão foi possível carregar o conteúdo desta lição."
          );
          addToast("Erro ao carregar a lição.", "error");
        }
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

  const handleQuizComplete = async (score: number) => {
    const totalQuestions = quizQuestions.length;
    const passed = score / totalQuestions >= 0.7;

    if (!passed) {
      addToast("Quase lá! Revise a lição e tente o quiz novamente.", "info");
      return;
    }

    setIsLoadingQuiz(true);
    try {
      addToast(
        "Parabéns, você passou no quiz! Salvando seu progresso...",
        "success"
      );
      
      const rewardData = await completeLesson(lessonId!);

      console.log('🎯 Lesson Completion Data:', {
        didLevelUp: rewardData.didLevelUp,
        newLevel: rewardData.level,
        unlockedBadge: rewardData.unlockedBadge,
        totalFinPoints: rewardData.totalFinPoints,
      });

      if (rewardData.didLevelUp && rewardData.unlockedBadge) {
        // Mostrar modal de badge desbloqueado (inclui level up)
        showBadgeUnlocked(
          rewardData.unlockedBadge,
          rewardData.level,
          rewardData.totalFinPoints
        );
      } else if (rewardData.didLevelUp) {
        // Mostrar apenas modal de level up (sem badge para este nível)
        showLevelUp(rewardData.level);
      }

      updateUserContext({
        totalFinPoints: rewardData.totalFinPoints,
        level: rewardData.level,
      });

      setIsQuizCompleted(true);
    } catch (error: any) {
      if (error.response?.data?.error === "CONFLICT") {
        addToast("Você já completou esta lição!", "info");
        setIsQuizCompleted(true);
      } else {
        console.error("Erro ao completar lição:", error);
        addToast("Erro ao salvar seu progresso. Tente novamente.", "error");
      }
    } finally {
      setIsLoadingQuiz(false);
    }
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
            <BookOpen size={16} /> <span>Educação Financeira</span>
          </div>
          <div className="meta-item">
            <Clock size={16} /> <span>{readingTime} min de leitura</span>
          </div>
        </S.LessonMeta>

        <S.ContentCard>
          <S.StyledMarkdown>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote: ({ node, children, ...props }) => {
                  const content = children?.toString() || '';
                  if (content.includes('💡')) {
                    return <S.HighlightBox>{children}</S.HighlightBox>;
                  }
                  return <blockquote {...props}>{children}</blockquote>;
                },
              }}
            >
              {lessonContent!}
            </ReactMarkdown>
          </S.StyledMarkdown>
        </S.ContentCard>
      </S.ContentWrapper>

      {quizQuestions.length > 0 && (
        <S.QuizContainer>
          <LessonQuiz
            questions={quizQuestions}
            onComplete={handleQuizComplete}
          />
        </S.QuizContainer>
      )}

      <S.FooterNavigation>
        <Button
          variant="outline"
          onClick={handlePreviousLesson}
          icon={<ArrowLeft size={16} />}
          disabled={isLoadingQuiz}
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
          disabled={
            isLoadingQuiz || (quizQuestions.length > 0 && !isQuizCompleted)
          }
        >
          {lessonDetails?.nextLessonId ? "Próxima Lição" : "Concluir Curso"}
        </Button>
      </S.FooterNavigation>
    </S.PageContainer>
  );
};

export default LessonPage;