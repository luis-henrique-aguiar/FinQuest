package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.LessonCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.QuizOptionDTO;
import br.edu.ifsp.prsi.finquest.dto.QuizQuestionDTO;
import br.edu.ifsp.prsi.finquest.events.LessonCompletedEvent;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserService userService;
    private final UserLessonCompletionRepository completionRepository;
    private final UserRepository userRepository;
    private final UserEnrollmentRepository enrollmentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public LessonServiceImpl(LessonRepository lessonRepository, QuestionRepository questionRepository,
                             UserService userService, UserLessonCompletionRepository completionRepository,
                             UserRepository userRepository, UserEnrollmentRepository enrollmentRepository,
                             ApplicationEventPublisher eventPublisher) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.userService = userService;
        this.completionRepository = completionRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.eventPublisher = eventPublisher;
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

    @Transactional
    public LessonCompletionDTO completeLesson(String lessonId, String userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lição não encontrada: " + lessonId));

        String courseId = lesson.getCourse().getId();

        UserLessonCompletionId completionId = new UserLessonCompletionId(userId, lessonId);
        if (completionRepository.existsById(completionId)) {
            throw new BusinessException("Lição já concluída.");
        }

        UserLessonCompletion completion = new UserLessonCompletion();
        completion.setId(completionId);
        completion.setCompletedAt(LocalDateTime.now());
        completion.setUser(userRepository.getReferenceById(userId));
        completion.setLesson(lesson);
        completionRepository.save(completion);

        try {
            LessonCompletedEvent event = new LessonCompletedEvent(this, userId, lessonId);
            eventPublisher.publishEvent(event);
            System.out.println("LessonService: Evento LessonCompletedEvent disparado.");
        } catch (Exception e) {
            System.err.println("Erro ao disparar LessonCompletedEvent: " + e.getMessage());
        }

        int pointsAwarded = lesson.getRecFinPoints();
        boolean didLevelUp = userService.addFinPoints(userId, pointsAwarded);

        User updatedUser = userRepository.findById(userId).get();

        int newCourseProgress = updateCourseProgress(userId, courseId);

        return new LessonCompletionDTO(
                pointsAwarded,
                updatedUser.getTotalFinPoints(),
                updatedUser.getLevel(),
                didLevelUp,
                newCourseProgress
        );
    }

    private int updateCourseProgress(String userId, String courseId) {
        long totalLessons = lessonRepository.countByCourseId(courseId);
        if (totalLessons == 0) return 0;

        long completedLessons = completionRepository.countCompletedLessonsByCourse(userId, courseId);

        int progressPercent = (int) (((double) completedLessons / totalLessons) * 100);

        UserEnrollment enrollment = enrollmentRepository.findById(new UserEnrollmentId(userId, courseId))
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada."));

        enrollment.setProgress(progressPercent);
        if (progressPercent == 100) {
            enrollment.setCompletionDate(LocalDate.now());
        }
        enrollmentRepository.save(enrollment);

        return progressPercent;
    }
}
