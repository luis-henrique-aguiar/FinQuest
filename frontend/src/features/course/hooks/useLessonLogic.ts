import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLesson, useLessonQuiz, useCompleteLesson } from '@/features/course/hooks/useCourse';

export const useLessonLogic = () => {
    const { courseId, lessonId } = useParams<{
        courseId: string;
        lessonId: string;
    }>();
    const navigate = useNavigate();

    const [lessonContent, setLessonContent] = useState<string | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    // TanStack Query hooks
    const { data: lessonDetails, isLoading: isLoadingDetails } = useLesson(lessonId);
    const { data: quizQuestions = [] } = useLessonQuiz(lessonId);
    const completeLesson = useCompleteLesson();

    // Scroll to top on lesson change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [lessonId]);

    // Load markdown content from public folder
    useEffect(() => {
        if (!lessonId) return;

        const loadContent = async () => {
            setIsLoadingContent(true);
            try {
                const filePath = `/lessons/${lessonId}.md`;
                const response = await fetch(filePath);

                if (!response.ok) {
                    throw new Error(`Lição não encontrada em ${filePath}`);
                }

                const content = await response.text();
                setLessonContent(content);
            } catch (error) {
                console.error('Erro ao carregar conteúdo da lição:', error);
                setLessonContent(
                    '# ❌ Erro ao Carregar\n\nNão foi possível carregar o conteúdo desta lição.'
                );
                toast.error('Erro ao carregar a lição.');
            } finally {
                setIsLoadingContent(false);
            }
        };

        loadContent();
    }, [lessonId]);

    // Calculate reading time from content
    const readingTime = useMemo(() => {
        if (!lessonContent) return 0;
        const wordCount = lessonContent.split(/\s+/).length;
        return Math.ceil(wordCount / 200); // 200 words per minute
    }, [lessonContent]);

    // Navigation handlers
    const handleNextLesson = () => {
        if (lessonDetails?.nextLessonId) {
            if (courseId) {
                navigate(`/learn/${courseId}/${lessonDetails.nextLessonId}`);
            }
        } else {
            toast.success('Parabéns, você concluiu o curso!');
            navigate(`/learn/${courseId}`);
        }
    };

    const handlePreviousLesson = () => {
        if (lessonDetails?.previousLessonId) {
            navigate(`/learn/${courseId}/${lessonDetails.previousLessonId}`);
        } else {
            navigate(`/learn/${courseId}`);
        }
    };

    // Quiz completion handler with TanStack Query mutation
    const handleQuizComplete = async (score: number) => {
        const totalQuestions = quizQuestions.length;
        const passed = score / totalQuestions >= 0.7;

        if (!passed) {
            toast.info('Quase lá! Revise a lição e tente o quiz novamente.');
            return;
        }

        if (!lessonId || !courseId) return;

        completeLesson.mutate(
            { lessonId, courseId: courseId },
            {
                onSuccess: () => {
                    toast.success('Parabéns, você passou no quiz!');
                    setIsQuizCompleted(true);
                },
                onError: (error: any) => {
                    if (error.response?.data?.error === 'CONFLICT') {
                        toast.info('Você já completou esta lição!');
                        setIsQuizCompleted(true);
                    } else {
                        toast.error('Erro ao salvar seu progresso. Tente novamente.');
                    }
                },
            }
        );
    };

    const isLoading = isLoadingDetails || isLoadingContent;

    return {
        courseId,
        lessonDetails,
        lessonContent,
        isLoading,
        readingTime,
        quizQuestions,
        isQuizCompleted,
        completeLesson,
        handleNextLesson,
        handlePreviousLesson,
        handleQuizComplete,
        navigate,
    };
};
