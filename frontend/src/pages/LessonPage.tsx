import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
} from "react-feather";
import { useToast } from "../hooks/useToast";
import {
  completeLesson,
  getLessonDetails,
  getLessonQuiz,
  getLessonContent,
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
import type { Achievement, User } from "../context/AuthContext";

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
        const contentPromise = getLessonContent(lessonId);
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
        setLessonContent(
          "# ❌ Erro ao Carregar\n\nNão foi possível carregar o conteúdo desta lição."
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

      const updateData: Partial<User> & { unlockedBadge?: Achievement } = {
        totalFinPoints: rewardData.totalFinPoints,
        level: rewardData.level,
      };

      if (rewardData.unlockedBadge) {
        updateData.unlockedBadge = {
          achievementId: Number(rewardData.unlockedBadge.id),
          title: rewardData.unlockedBadge.title,
          icon: rewardData.unlockedBadge.icon,
          unlockedDate: new Date().toISOString(),
        };
      }

      if (rewardData.didLevelUp && rewardData.unlockedBadge) {
        showBadgeUnlocked(
          rewardData.unlockedBadge,
          rewardData.level,
          rewardData.totalFinPoints
        );
      } else if (rewardData.didLevelUp) {
        showLevelUp(rewardData.level);
      }

      updateUserContext(updateData);
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
            <BookOpen size={18} />
            <span>Educação Financeira</span>
          </div>
          <div className="meta-item">
            <Clock size={18} />
            <span>{readingTime} min de leitura</span>
          </div>
        </S.LessonMeta>

        <S.ContentCard>
          <S.StyledMarkdown>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote: ({ children }) => {
                  const content = children?.toString() || "";

                  if (content.includes("💡")) {
                    return (
                      <S.TipBox>
                        <div className="tip-icon">
                          <Zap size={24} />
                        </div>
                        <div className="tip-content">{children}</div>
                      </S.TipBox>
                    );
                  }

                  if (
                    content.includes("⚠️") ||
                    content.includes("Atenção") ||
                    content.includes("Cuidado")
                  ) {
                    return (
                      <S.WarningBox>
                        <div className="warning-icon">
                          <AlertCircle size={24} />
                        </div>
                        <div className="warning-content">{children}</div>
                      </S.WarningBox>
                    );
                  }

                  if (content.includes("✅")) {
                    return (
                      <S.SuccessBox>
                        <div className="success-icon">
                          <CheckCircle size={24} />
                        </div>
                        <div className="success-content">{children}</div>
                      </S.SuccessBox>
                    );
                  }

                  return <S.QuoteBox>{children}</S.QuoteBox>;
                },

                code: ({ node, inline, children, ...props }: any) => {
                  if (inline) {
                    return <S.InlineCode>{children}</S.InlineCode>;
                  }
                  return <code {...props}>{children}</code>;
                },

                li: ({ node, children, ...props }: any) => {
                  return <S.ListItem {...props}>{children}</S.ListItem>;
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
          {lessonDetails?.nextLessonId ? "Próxima Lição" : "Concluir Lição"}
        </Button>
      </S.FooterNavigation>
    </S.PageContainer>
  );
};

export default LessonPage;
