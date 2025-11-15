package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.events.LessonCompletedEvent;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceImpl implements LessonService {

    private static final Logger logger = LoggerFactory.getLogger(LessonServiceImpl.class);

    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserService userService;
    private final UserLessonCompletionRepository completionRepository;
    private final UserRepository userRepository;
    private final UserEnrollmentRepository enrollmentRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final AchievementRepository achievementRepository;

    public LessonServiceImpl(
            LessonRepository lessonRepository,
            QuestionRepository questionRepository,
            UserService userService,
            UserLessonCompletionRepository completionRepository,
            UserRepository userRepository,
            UserEnrollmentRepository enrollmentRepository,
            ApplicationEventPublisher eventPublisher,
            AchievementRepository achievementRepository
    ) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.userService = userService;
        this.completionRepository = completionRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.eventPublisher = eventPublisher;
        this.achievementRepository = achievementRepository;
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
            logger.info("Evento LessonCompletedEvent disparado para userId={}, lessonId={}", userId, lessonId);
        } catch (Exception e) {
            logger.error("Erro ao disparar LessonCompletedEvent: {}", e.getMessage(), e);
        }

        int pointsAwarded = lesson.getRecFinPoints();

        boolean didLevelUp = userService.addFinPoints(userId, pointsAwarded);

        User updatedUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        AchievementDTO unlockedBadge = null;
        if (didLevelUp) {
            Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(updatedUser.getLevel());
            unlockedBadge = badgeOpt.map(AchievementDTO::new).orElse(null);

            if (unlockedBadge != null) {
                logger.info("Badge '{}' será exibido ao usuário {}", unlockedBadge.title(), userId);
            }
        }

        int newCourseProgress = updateCourseProgress(userId, courseId);

        return new LessonCompletionDTO(
                pointsAwarded,
                updatedUser.getTotalFinPoints(),
                updatedUser.getLevel(),
                didLevelUp,
                newCourseProgress,
                unlockedBadge
        );
    }

    private int updateCourseProgress(String userId, String courseId) {
        long totalLessons = lessonRepository.countByCourseId(courseId);
        if (totalLessons == 0) {
            logger.warn("Curso {} não possui lições cadastradas", courseId);
            return 0;
        }

        long completedLessons = completionRepository.countCompletedLessonsByCourse(userId, courseId);

        int progressPercent = (int) (((double) completedLessons / totalLessons) * 100);

        UserEnrollment enrollment = enrollmentRepository.findById(new UserEnrollmentId(userId, courseId))
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada para userId=" + userId + ", courseId=" + courseId));

        enrollment.setProgress(progressPercent);

        if (progressPercent == 100 && enrollment.getCompletionDate() == null) {
            enrollment.setCompletionDate(LocalDate.now());
            logger.info("Usuário {} concluiu o curso {}", userId, courseId);
        }

        enrollmentRepository.save(enrollment);

        return progressPercent;
    }
}
