import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonQuiz } from '@/features/gamification/components/LessonQuiz';
import { cn } from '@/lib/utils';
import { useLessonLogic } from '@/features/course/hooks/useLessonLogic';

export const LessonPage = () => {
  const {
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
  } = useLessonLogic();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando conteúdo da lição...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/learn/${courseId}`)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Voltar para o curso"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex-1 truncate">
            {lessonDetails?.title || 'Carregando...'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* LESSON METADATA */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen size={18} className="text-primary" />
            <span>Educação Financeira</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock size={18} className="text-primary" />
            <span>{readingTime} min de leitura</span>
          </div>
        </div>

        {/* MARKDOWN CONTENT */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-10 shadow-sm border border-zinc-200 dark:border-zinc-800 prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 pb-4 border-b-2 border-primary/20">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-10 mb-6 border-l-4 border-secondary pl-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 my-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 my-6 text-zinc-700 dark:text-zinc-300 marker:text-primary">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 my-6 text-zinc-700 dark:text-zinc-300 marker:text-primary font-medium">{children}</ol>
              ),
              blockquote: ({ children }) => {
                const content = children?.toString() || '';

                // Tip Box
                if (content.includes('💡')) {
                  return (
                    <div className="flex gap-4 p-6 my-8 rounded-lg bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 shadow-sm">
                      <div className="shrink-0 text-amber-500 mt-1"><Zap size={24} /></div>
                      <div className="text-zinc-800 dark:text-zinc-200">{children}</div>
                    </div>
                  );
                }

                // Warning Box
                if (
                  content.includes('⚠️') ||
                  content.includes('Atenção') ||
                  content.includes('Cuidado')
                ) {
                  return (
                    <div className="flex gap-4 p-6 my-8 rounded-lg bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 shadow-sm">
                      <div className="shrink-0 text-red-500 mt-1"><AlertCircle size={24} /></div>
                      <div className="text-zinc-800 dark:text-zinc-200">{children}</div>
                    </div>
                  );
                }

                // Success Box
                if (content.includes('✅')) {
                  return (
                    <div className="flex gap-4 p-6 my-8 rounded-lg bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 shadow-sm">
                      <div className="shrink-0 text-green-500 mt-1"><CheckCircle size={24} /></div>
                      <div className="text-zinc-800 dark:text-zinc-200">{children}</div>
                    </div>
                  );
                }

                // Default Quote
                return (
                  <blockquote className="relative p-8 my-8 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-lg italic text-zinc-700 dark:text-zinc-300 shadow-sm">
                    <span className="absolute top-4 left-4 text-4xl text-blue-500/20 font-serif leading-none">"</span>
                    <div className="relative z-10">{children}</div>
                  </blockquote>
                );
              },
              code: ({ inline, children, className, ...props }: any) => {
                if (inline) {
                  return (
                    <code className="bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-200 dark:border-zinc-700">
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-6 shadow-md border border-zinc-800">
                    <code className={cn("font-mono text-sm", className)} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              table: ({ children }) => (
                <div className="overflow-x-auto my-8 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <table className="w-full border-collapse text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold border-b border-zinc-200 dark:border-zinc-700">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-6 py-3 text-left">{children}</th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{children}</td>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg shadow-lg max-w-full h-auto mx-auto my-8 border border-zinc-200 dark:border-zinc-800"
                />
              ),
              hr: () => (
                <hr className="my-10 border-t-2 border-zinc-100 dark:border-zinc-800" />
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors font-medium"
                >
                  {children}
                </a>
              ),
            }}
          >
            {lessonContent!}
          </ReactMarkdown>
        </div>

        {/* QUIZ SECTION */}
        {quizQuestions.length > 0 && (
          <div className="mt-12">
            <LessonQuiz
              questions={quizQuestions}
              onComplete={handleQuizComplete}
            />
          </div>
        )}

        {/* FOOTER NAVIGATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            disabled={completeLesson.isPending}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lessonDetails?.previousLessonId ? 'Lição Anterior' : 'Voltar ao Curso'}
          </Button>

          <Button
            onClick={handleNextLesson}
            disabled={completeLesson.isPending || (quizQuestions.length > 0 && !isQuizCompleted)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
          >
            {lessonDetails?.nextLessonId ? 'Próxima Lição' : 'Concluir Lição'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
