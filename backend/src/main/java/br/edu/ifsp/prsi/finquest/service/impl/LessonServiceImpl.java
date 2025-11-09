package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.QuizOptionDTO;
import br.edu.ifsp.prsi.finquest.dto.QuizQuestionDTO;
import br.edu.ifsp.prsi.finquest.model.Alternative;
import br.edu.ifsp.prsi.finquest.model.Lesson;
import br.edu.ifsp.prsi.finquest.model.Question;
import br.edu.ifsp.prsi.finquest.repository.LessonRepository;
import br.edu.ifsp.prsi.finquest.repository.QuestionRepository;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;

    public LessonServiceImpl(LessonRepository lessonRepository, QuestionRepository questionRepository) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
    }

    public List<QuizQuestionDTO> getLessonQuiz(String lessonId) {
        List<Question> questions = questionRepository.findAllByLessonIdOrderByOrderAsc(lessonId);

        if (questions.isEmpty()) {
            throw new EntityNotFoundException("Nenhuma questão encontrada para a lição: " + lessonId);
        }

        return questions.stream()
                .map(this::mapQuestionToDTO)
                .toList();
    }

    private QuizQuestionDTO mapQuestionToDTO(Question question) {
        List<QuizOptionDTO> options = new ArrayList<>();
        String correctAnswer = "";
        char letter = 'A';

        for (Alternative alt : question.getAlternatives()) {
            String currentLetter = String.valueOf(letter++);

            options.add(new QuizOptionDTO(currentLetter, alt.getText()));

            if (alt.getIsCorrect()) {
                correctAnswer = currentLetter;
            }
        }

        return new QuizQuestionDTO(
                question.getStatement(),
                options,
                correctAnswer,
                question.getExplanation()
        );
    }

    public LessonDetailsDTO getLessonDetails(String lessonId) {
        Lesson currentLesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lição não encontrada: " + lessonId));

        String courseId = currentLesson.getCourse().getId();
        int currentOrder = currentLesson.getLessonOrder();

        String nextLessonId = lessonRepository
                .findByCourseIdAndLessonOrder(courseId, currentOrder + 1)
                .map(Lesson::getId)
                .orElse(null);

        String previousLessonId = lessonRepository
                .findByCourseIdAndLessonOrder(courseId, currentOrder - 1)
                .map(Lesson::getId)
                .orElse(null);

        return new LessonDetailsDTO(currentLesson, nextLessonId, previousLessonId);
    }
}
