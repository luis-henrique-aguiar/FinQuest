import React, { useState } from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface QuizOption {
  letter: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({
  questions,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    setIsSubmitted(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      if (onComplete) {
        onComplete(isCorrect ? score + 1 : score);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <Card className="border-t-4 border-t-primary shadow-sm">
        <CardHeader>
          <h3 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            {passed ? "🎉" : "📚"} Questionário Concluído!
          </h3>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className={cn(
            "flex gap-4 p-4 rounded-lg border-l-4",
            passed
              ? "bg-green-50 dark:bg-green-900/20 border-l-green-500"
              : "bg-red-50 dark:bg-red-900/20 border-l-red-500"
          )}>
            <div className="shrink-0">
              {passed ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1 text-zinc-900 dark:text-zinc-50">
                {passed ? "Parabéns!" : "Continue Praticando!"}
              </h4>
              <p className="text-zinc-700 dark:text-zinc-300">
                Você acertou <strong className="text-zinc-900 dark:text-zinc-50">{score} de {questions.length}</strong> questões ({percentage.toFixed(0)}%).
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {passed
                  ? "Excelente trabalho! Você demonstrou um ótimo entendimento do conteúdo."
                  : "Revise o conteúdo da lição e tente novamente. A prática leva à perfeição!"
                }
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-4 border-t">
          <Button variant="outline" onClick={handleRetry} className="w-full sm:w-auto">
            Tentar Novamente
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-primary shadow-sm bg-white dark:bg-zinc-900">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <HelpCircle className="w-6 h-6 text-primary" />
            Teste seus Conhecimentos
          </h3>
          <span className="text-sm text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            Questão {currentQuestion + 1} de {questions.length}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
            {question.question}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.letter;
            const isCorrectOption = option.letter === question.correctAnswer;
            const showCorrect = isSubmitted && isCorrectOption;
            const showIncorrect = isSubmitted && isSelected && !isCorrect;

            return (
              <label
                key={option.letter}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden",
                  isSubmitted ? "cursor-not-allowed" : "hover:border-primary hover:bg-primary/5",
                  isSelected ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
                  showCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20",
                  showIncorrect && "border-red-500 bg-red-50 dark:bg-red-900/20"
                )}
                onClick={() => !isSubmitted && setSelectedAnswer(option.letter)}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={option.letter}
                  checked={isSelected}
                  onChange={() => !isSubmitted && setSelectedAnswer(option.letter)}
                  disabled={isSubmitted}
                  className="hidden"
                />

                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-colors",
                  isSelected || showCorrect || showIncorrect
                    ? "text-white border-transparent"
                    : "text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800",
                  showCorrect ? "bg-green-500" : showIncorrect ? "bg-red-500" : isSelected ? "bg-primary" : ""
                )}>
                  {option.letter}
                </div>

                <div className="flex-1 text-base text-zinc-900 dark:text-zinc-100">
                  {option.text}
                </div>

                {showCorrect && <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />}
                {showIncorrect && <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
              </label>
            );
          })}
        </div>

        {isSubmitted && (
          <div className={cn(
            "mt-6 p-4 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2",
            isCorrect
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
          )}>
            <div className="shrink-0 mt-0.5">
              {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <p className="font-bold mb-1">{isCorrect ? "Correto!" : "Incorreto"}</p>
              <p className="text-sm leading-relaxed opacity-90">{question.explanation}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        {!isSubmitted ? (
          <Button
            className="w-full py-6 text-lg"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Enviar Resposta
          </Button>
        ) : (
          <Button
            className="w-full py-6 text-lg"
            onClick={handleNext}
          >
            {currentQuestion < questions.length - 1 ? "Próxima Questão" : "Ver Resultado"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};