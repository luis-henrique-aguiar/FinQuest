package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final AchievementRepository achievementRepository;
    private final MissionServiceImpl missionService;

    public LessonServiceImpl(
            LessonRepository lessonRepository,
            QuestionRepository questionRepository,
            UserService userService,
            UserLessonCompletionRepository completionRepository,
            UserRepository userRepository,
            UserEnrollmentRepository enrollmentRepository,
            AchievementRepository achievementRepository,
            MissionServiceImpl missionService
    ) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.userService = userService;
        this.completionRepository = completionRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.achievementRepository = achievementRepository;
        this.missionService = missionService;
    }

    @Transactional(readOnly = true)
    public List<QuizQuestionDTO> getLessonQuiz(String lessonId) {
        logger.debug("Buscando quiz da licao: lessonId={}", lessonId);

        List<Question> questions = questionRepository.findAllByLessonIdOrderByOrderAsc(lessonId);

        if (questions.isEmpty()) {
            throw new EntityNotFoundException("Nenhuma questao encontrada para a licao: " + lessonId);
        }

        return questions.stream()
                .map(this::mapQuestionToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonDetailsDTO getLessonDetails(String lessonId) {
        logger.debug("Buscando detalhes da licao: lessonId={}", lessonId);

        Lesson currentLesson = findLessonOrThrow(lessonId);

        String nextLessonId = findAdjacentLessonId(currentLesson, 1);
        String previousLessonId = findAdjacentLessonId(currentLesson, -1);

        return new LessonDetailsDTO(currentLesson, nextLessonId, previousLessonId);
    }

    @Transactional
    public LessonCompletionDTO completeLesson(String lessonId, String userId) {
        logger.info("Iniciando conclusao de licao: lessonId={}, userId={}", lessonId, userId);

        Lesson lesson = findLessonOrThrow(lessonId);
        validateLessonNotCompleted(lessonId, userId);

        User userBefore = findUserOrThrow(userId);
        int levelBefore = userBefore.getLevel();

        logger.debug("Estado inicial do usuario: userId={}, level={}, finPoints={}",
                userId, levelBefore, userBefore.getTotalFinPoints());

        saveLessonCompletion(lessonId, userId, lesson);
        processMissionProgress(userId, lessonId);
        awardLessonPoints(userId, lesson.getRecFinPoints());

        LessonCompletionDTO result = buildCompletionResult(
                userId,
                lesson,
                levelBefore
        );

        logger.info("Licao concluida com sucesso: lessonId={}, userId={}, pointsAwarded={}, levelUp={}",
                lessonId, userId, lesson.getRecFinPoints(), result.didLevelUp());

        return result;
    }

    private void validateLessonNotCompleted(String lessonId, String userId) {
        UserLessonCompletionId completionId = new UserLessonCompletionId(userId, lessonId);

        if (completionRepository.existsById(completionId)) {
            logger.warn("Tentativa de concluir licao ja finalizada: lessonId={}, userId={}",
                    lessonId, userId);
            throw new BusinessException("Licao ja concluida.");
        }
    }

    private void saveLessonCompletion(String lessonId, String userId, Lesson lesson) {
        UserLessonCompletionId completionId = new UserLessonCompletionId(userId, lessonId);

        UserLessonCompletion completion = new UserLessonCompletion();
        completion.setId(completionId);
        completion.setCompletedAt(LocalDateTime.now());
        completion.setUser(userRepository.getReferenceById(userId));
        completion.setLesson(lesson);

        completionRepository.save(completion);

        logger.debug("Registro de conclusao salvo: lessonId={}, userId={}", lessonId, userId);
    }

    private void processMissionProgress(String userId, String lessonId) {
        try {
            missionService.processLessonCompletion(userId, lessonId);
        } catch (Exception e) {
            logger.error("Erro ao processar missoes da licao: lessonId={}, userId={}, error={}",
                    lessonId, userId, e.getMessage(), e);
        }
    }

    private void awardLessonPoints(String userId, int points) {
        userService.addFinPoints(userId, points);
        logger.debug("Pontos concedidos: userId={}, points={}", userId, points);
    }

    private LessonCompletionDTO buildCompletionResult(String userId, Lesson lesson, int levelBefore) {
        User updatedUser = findUserOrThrow(userId);

        int currentLevel = updatedUser.getLevel();
        boolean leveledUp = currentLevel > levelBefore;

        AchievementDTO unlockedBadge = leveledUp
                ? findBadgeForLevel(currentLevel)
                : null;

        int courseProgress = updateCourseProgress(userId, lesson.getCourse().getId());

        return new LessonCompletionDTO(
                lesson.getRecFinPoints(),
                updatedUser.getTotalFinPoints(),
                currentLevel,
                leveledUp,
                courseProgress,
                unlockedBadge
        );
    }

    private int updateCourseProgress(String userId, String courseId) {
        long totalLessons = lessonRepository.countByCourseId(courseId);

        if (totalLessons == 0) {
            logger.warn("Curso sem licoes cadastradas: courseId={}", courseId);
            return 0;
        }

        long completedLessons = completionRepository.countCompletedLessonsByCourse(userId, courseId);
        int progressPercent = calculateProgressPercent(completedLessons, totalLessons);

        updateEnrollmentProgress(userId, courseId, progressPercent);

        logger.debug("Progresso do curso atualizado: courseId={}, userId={}, progresso={}%",
                courseId, userId, progressPercent);

        return progressPercent;
    }

    private int calculateProgressPercent(long completed, long total) {
        return (int) (((double) completed / total) * 100);
    }

    private void updateEnrollmentProgress(String userId, String courseId, int progressPercent) {
        UserEnrollmentId enrollmentId = new UserEnrollmentId(userId, courseId);

        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Matricula nao encontrada: userId=" + userId + ", courseId=" + courseId));

        enrollment.setProgress(progressPercent);

        if (progressPercent == 100 && enrollment.getCompletionDate() == null) {
            enrollment.setCompletionDate(LocalDate.now());
            logger.info("Curso concluido: courseId={}, userId={}", courseId, userId);
        }

        enrollmentRepository.save(enrollment);
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

    private Lesson findLessonOrThrow(String lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Licao nao encontrada: " + lessonId));
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + userId));
    }

    private String findAdjacentLessonId(Lesson currentLesson, int offset) {
        String courseId = currentLesson.getCourse().getId();
        int targetOrder = currentLesson.getLessonOrder() + offset;

        return lessonRepository
                .findByCourseIdAndLessonOrder(courseId, targetOrder)
                .map(Lesson::getId)
                .orElse(null);
    }

    private AchievementDTO findBadgeForLevel(int level) {
        Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(level);

        if (badgeOpt.isPresent()) {
            Achievement badge = badgeOpt.get();
            logger.info("Badge desbloqueado: level={}, badgeTitle='{}'", level, badge.getTitle());
            return new AchievementDTO(badge);
        }

        logger.warn("Nenhum badge encontrado para o nivel: level={}", level);
        return null;
    }
}