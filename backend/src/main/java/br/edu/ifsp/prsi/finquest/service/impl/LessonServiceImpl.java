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

    @Override
    @Transactional(readOnly = true)
    public List<QuizQuestionDTO> getLessonQuiz(String lessonId) {
        logger.debug("Iniciando busca de quiz: lessonId={}", lessonId);

        List<Question> questions = questionRepository.findAllByLessonIdOrderByOrderAsc(lessonId);

        if (questions.isEmpty()) {
            logger.warn("Quiz vazio ou inexistente para a lição: lessonId={}", lessonId);
            throw new EntityNotFoundException("Nenhuma questao encontrada para a licao: " + lessonId);
        }

        logger.debug("Quiz carregado com sucesso: lessonId={}, totalQuestions={}", lessonId, questions.size());

        return questions.stream()
                .map(this::mapQuestionToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LessonDetailsDTO getLessonDetails(String lessonId) {
        logger.debug("Carregando detalhes da lição: lessonId={}", lessonId);

        Lesson currentLesson = findLessonOrThrow(lessonId);

        String nextLessonId = findAdjacentLessonId(currentLesson, 1);
        String previousLessonId = findAdjacentLessonId(currentLesson, -1);

        logger.debug("Navegação calculada: current={}, prev={}, next={}",
                lessonId, previousLessonId, nextLessonId);

        return new LessonDetailsDTO(currentLesson, nextLessonId, previousLessonId);
    }

    @Override
    @Transactional
    public LessonCompletionDTO completeLesson(String lessonId, String userId) {
        logger.info("Solicitação de conclusão de lição: lessonId={}, userId={}", lessonId, userId);

        Lesson lesson = findLessonOrThrow(lessonId);
        validateLessonNotCompleted(lessonId, userId);

        User userBefore = findUserOrThrow(userId);
        int levelBefore = userBefore.getLevel();

        saveLessonCompletion(lessonId, userId, lesson);

        processMissionProgress(userId, lessonId);

        awardLessonPoints(userId, lesson.getRecFinPoints());

        LessonCompletionDTO result = buildCompletionResult(userId, lesson, levelBefore);

        logger.info("✅ Lição concluída: lessonId={}, user={}, pontos={}, levelUp={}",
                lessonId, userId, lesson.getRecFinPoints(), result.didLevelUp());

        return result;
    }

    private void validateLessonNotCompleted(String lessonId, String userId) {
        UserLessonCompletionId completionId = new UserLessonCompletionId(userId, lessonId);

        if (completionRepository.existsById(completionId)) {
            logger.warn("Tentativa duplicada de concluir lição: lessonId={}, userId={}", lessonId, userId);
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
        logger.debug("Registro de conclusão salvo no banco: lessonId={}, userId={}", lessonId, userId);
    }

    private void processMissionProgress(String userId, String lessonId) {
        try {
            missionService.processLessonCompletion(userId, lessonId);
        } catch (Exception e) {
            logger.error("Falha ao processar missões para lição {}: {}", lessonId, e.getMessage(), e);
        }
    }

    private void awardLessonPoints(String userId, int points) {
        userService.addFinPoints(userId, points);
        logger.debug("Pontos adicionados ao usuário: userId={}, points={}", userId, points);
    }

    private LessonCompletionDTO buildCompletionResult(String userId, Lesson lesson, int levelBefore) {
        User updatedUser = findUserOrThrow(userId);
        int currentLevel = updatedUser.getLevel();
        boolean leveledUp = currentLevel > levelBefore;

        AchievementDTO unlockedBadge = null;
        if (leveledUp) {
            logger.info("🎉 LEVEL UP (via Lição)! Usuário {} subiu para o nível {}", userId, currentLevel);
            unlockedBadge = findBadgeForLevel(currentLevel);
        }

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
            logger.warn("Inconsistência de dados: Curso {} não possui lições cadastradas.", courseId);
            return 0;
        }

        long completedLessons = completionRepository.countCompletedLessonsByCourse(userId, courseId);
        int progressPercent = calculateProgressPercent(completedLessons, totalLessons);

        updateEnrollmentProgress(userId, courseId, progressPercent);

        logger.info("Progresso do curso atualizado: courseId={}, userId={}, progresso={}% ({}/{})",
                courseId, userId, progressPercent, completedLessons, totalLessons);

        return progressPercent;
    }

    private int calculateProgressPercent(long completed, long total) {
        return (int) (((double) completed / total) * 100);
    }

    private void updateEnrollmentProgress(String userId, String courseId, int progressPercent) {
        UserEnrollmentId enrollmentId = new UserEnrollmentId(userId, courseId);

        UserEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> {
                    logger.error("Erro crítico: Usuário {} completou lição sem matrícula no curso {}", userId, courseId);
                    return new EntityNotFoundException("Matricula nao encontrada: userId=" + userId + ", courseId=" + courseId);
                });

        enrollment.setProgress(progressPercent);

        if (progressPercent == 100 && enrollment.getCompletionDate() == null) {
            enrollment.setCompletionDate(LocalDate.now());
            logger.info("🏆 CURSO CONCLUÍDO! Usuário {} finalizou o curso {}", userId, courseId);
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
                .orElseThrow(() -> {
                    logger.warn("Lição não encontrada: {}", lessonId);
                    return new EntityNotFoundException("Licao nao encontrada: " + lessonId);
                });
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
            logger.info("Badge de Nível Desbloqueado: '{}'", badge.getTitle());
            return new AchievementDTO(badge);
        }

        logger.debug("Nenhum badge configurado para o nível {}", level);
        return null;
    }
}