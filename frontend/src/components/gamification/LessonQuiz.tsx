import React, { useState } from "react";
import { CheckCircle, XCircle, HelpCircle } from "react-feather";
import Button from "../common/Button";
import * as S from "../../pages/LessonPage.styles"; 

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

  // Pega a questão atual
  const question = questions[currentQuestion];
  // Verifica se a resposta selecionada é a correta
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Lógica para quando o usuário envia a resposta
  const handleSubmit = () => {
    if (!selectedAnswer) return; // Não faz nada se nenhuma opção foi selecionada

    setIsSubmitted(true); // Trava as opções e mostra o feedback

    if (isCorrect) {
      setScore((prev) => prev + 1); // Incrementa a pontuação
    }
  };

  // Lógica para ir para a próxima questão ou finalizar
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      // Ainda há mais questões
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      // É a última questão, finaliza o quiz
      setIsCompleted(true);
      if (onComplete) {
        // Envia a pontuação final (considerando a última resposta)
        onComplete(isCorrect ? score + 1 : score);
      }
    }
  };

  // Lógica para reiniciar o quiz
  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  // --- Renderização da Tela Final (Resultados) ---
  if (isCompleted) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70; // Define 70% como nota de corte

    return (
      <S.QuizCard>
        <S.QuizHeader>
          <h3>{passed ? "🎉" : "📚"} Questionário Concluído!</h3>
        </S.QuizHeader>

        <S.QuizFeedback $correct={passed}>
          <div className="feedback-icon">
            {passed ? (
              <CheckCircle size={32} color="#28A745" />
            ) : (
              <XCircle size={32} color="#DC3545" />
            )}
          </div>
          <div className="feedback-content">
            <h4>{passed ? "Parabéns!" : "Continue Praticando!"}</h4>
            <p>
              Você acertou{" "}
              <strong>
                {score} de {questions.length}
              </strong>{" "}
              questões ({percentage.toFixed(0)}%).
            </p>
            {passed ? (
              <p>
                Excelente trabalho! Você demonstrou um ótimo entendimento do
                conteúdo.
              </p>
            ) : (
              <p>
                Revise o conteúdo da lição e tente novamente. A prática leva à
                perfeição!
              </p>
            )}
          </div>
        </S.QuizFeedback>

        <S.QuizSubmitButton>
          <Button variant="outline" onClick={handleRetry} fullWidth>
            Tentar Novamente
          </Button>
        </S.QuizSubmitButton>
      </S.QuizCard>
    );
  }

  // --- Renderização da Questão Atual ---
  return (
    <S.QuizCard>
      <S.QuizHeader>
        <h3>
          <HelpCircle size={28} /> Teste seus Conhecimentos
        </h3>
        <p>
          Questão {currentQuestion + 1} de {questions.length}
        </p>
      </S.QuizHeader>

      <S.QuizQuestion>
        <div className="question-text">{question.question}</div>

        <S.QuizOptions>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.letter;
            const isCorrectOption = option.letter === question.correctAnswer;
            const showCorrect = isSubmitted && isCorrectOption;
            const showIncorrect = isSubmitted && isSelected && !isCorrect;

            return (
              <S.QuizOption
                key={option.letter}
                $selected={isSelected}
                $correct={showCorrect}
                $incorrect={showIncorrect}
                $disabled={isSubmitted}
                onClick={() => !isSubmitted && setSelectedAnswer(option.letter)}
              >
                {/* O input radio está escondido, mas ainda funciona para acessibilidade */}
                <input
                  type="radio"
                  name="quiz-option"
                  value={option.letter}
                  checked={isSelected}
                  onChange={() =>
                    !isSubmitted && setSelectedAnswer(option.letter)
                  }
                  disabled={isSubmitted}
                />
                <div className="option-letter">{option.letter}</div>
                <div className="option-text">{option.text}</div>
                {showCorrect && (
                  <CheckCircle
                    className="option-icon"
                    size={24}
                    color="#28A745"
                  />
                )}
                {showIncorrect && (
                  <XCircle
                    className="option-icon"
                    size={24}
                    color="#DC3545"
                  />
                )}
              </S.QuizOption>
            );
          })}
        </S.QuizOptions>
      </S.QuizQuestion>

      {/* --- Feedback Imediato (após enviar) --- */}
      {isSubmitted && (
        <S.QuizFeedback $correct={isCorrect}>
          <div className="feedback-icon">
            {isCorrect ? (
              <CheckCircle size={28} color="#28A745" />
            ) : (
              <XCircle size={28} color="#DC3545" />
            )}
          </div>
          <div className="feedback-content">
            <h4>{isCorrect ? "Correto!" : "Incorreto"}</h4>
            <p>{question.explanation}</p>
          </div>
        </S.QuizFeedback>
      )}

      {/* --- Botão de Ação (Enviar ou Próximo) --- */}
      <S.QuizSubmitButton>
        {!isSubmitted ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            fullWidth
          >
            Enviar Resposta
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext} fullWidth>
            {currentQuestion < questions.length - 1
              ? "Próxima Questão"
              : "Ver Resultado"}
          </Button>
        )}
      </S.QuizSubmitButton>
    </S.QuizCard>
  );
};