package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import br.edu.ifsp.prsi.finquest.service.StorageService;
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
    private final CourseRepository courseRepository;
    private final AlternativeRepository alternativeRepository;
    private final StorageService storageService;

    public LessonServiceImpl(
            LessonRepository lessonRepository,
            QuestionRepository questionRepository,
            UserService userService,
            UserLessonCompletionRepository completionRepository,
            UserRepository userRepository,
            UserEnrollmentRepository enrollmentRepository,
            AchievementRepository achievementRepository,
            MissionServiceImpl missionService,
            CourseRepository courseRepository,
            AlternativeRepository alternativeRepository,
            StorageService storageService
    ) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.userService = userService;
        this.completionRepository = completionRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.achievementRepository = achievementRepository;
        this.missionService = missionService;
        this.courseRepository = courseRepository;
        this.alternativeRepository = alternativeRepository;
        this.storageService = storageService;
    }

    // ========================================
    // Content Management Methods
    // ========================================

    @Override
    @Transactional
    public LessonDetailsDTO createLesson(LessonCreateDTO dto) {
        logger.info("Criando nova lição: courseId={}, order={}, title={}", 
            dto.courseId(), dto.lessonOrder(), dto.title());

        // Validate course exists
        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> {
                    logger.warn("Curso não encontrado: {}", dto.courseId());
                    return new EntityNotFoundException("Curso não encontrado: " + dto.courseId());
                });

        // Validate unique (courseId, lessonOrder)
        if (lessonRepository.existsByCourseIdAndLessonOrder(dto.courseId(), dto.lessonOrder())) {
            logger.warn("Ordem duplicada: courseId={}, order={}", dto.courseId(), dto.lessonOrder());
            throw new BusinessException("Já existe uma lição com esta ordem neste curso");
        }

        // Generate lesson ID in format "M{courseId}-L{order}"
        String lessonId = String.format("M%s-L%d", dto.courseId(), dto.lessonOrder());

        // Upload content to Firebase Storage
        String contentUrl;
        try {
            contentUrl = storageService.uploadLessonContentFromString(dto.content(), lessonId);
            logger.debug("Conteúdo enviado para o Storage: url={}", contentUrl);
        } catch (Exception e) {
            logger.error("Erro ao fazer upload do conteúdo: {}", e.getMessage(), e);
            throw new BusinessException("Erro ao fazer upload do conteúdo: " + e.getMessage());
        }

        // Create and save lesson
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setTitle(dto.title());
        lesson.setCourse(course);
        lesson.setLessonOrder(dto.lessonOrder());
        lesson.setContentUrl(contentUrl);
        lesson.setRecFinPoints(dto.recFinPoints());
        lesson.setIsDraft(dto.isDraft() != null ? dto.isDraft() : true);

        lessonRepository.save(lesson);

        logger.info("✅ Lição criada com sucesso: id={}, contentUrl={}", lessonId, contentUrl);

        return new LessonDetailsDTO(lesson, null, null);
    }

    @Override
    @Transactional
    public LessonDetailsDTO updateLesson(String lessonId, LessonUpdateDTO dto) {
        logger.info("Atualizando lição: lessonId={}", lessonId);

        Lesson lesson = findLessonOrThrow(lessonId);

        // Update only non-null fields
        if (dto.title() != null) {
            lesson.setTitle(dto.title());
        }
        if (dto.content() != null) {
            // Update content in Firebase Storage
            try {
                String updatedUrl = storageService.updateLessonContent(dto.content(), lesson.getContentUrl());
                lesson.setContentUrl(updatedUrl);
                logger.debug("Conteúdo atualizado no Storage: url={}", updatedUrl);
            } catch (Exception e) {
                logger.error("Erro ao atualizar conteúdo no storage: {}", e.getMessage(), e);
                throw new BusinessException("Erro ao atualizar conteúdo: " + e.getMessage());
            }
        }
        if (dto.recFinPoints() != null) {
            lesson.setRecFinPoints(dto.recFinPoints());
        }
        if (dto.isDraft() != null) {
            lesson.setIsDraft(dto.isDraft());
        }

        // lastModified is automatically updated by @PreUpdate

        lessonRepository.save(lesson);

        logger.info("✅ Lição atualizada: id={}", lessonId);

        return new LessonDetailsDTO(lesson, null, null);
    }

    @Override
    @Transactional
    public void deleteLesson(String lessonId) {
        logger.info("Deletando lição: lessonId={}", lessonId);

        Lesson lesson = findLessonOrThrow(lessonId);

        // Check if users have completed this lesson
        long completionCount = completionRepository.countByLessonId(lessonId);
        if (completionCount > 0) {
            logger.warn("Tentativa de deletar lição com {} conclusões", completionCount);
            throw new BusinessException(
                String.format("Não é possível deletar esta lição. %d usuário(s) já completaram.", completionCount)
            );
        }

        // Delete content from Firebase Storage
        try {
            storageService.deleteLessonContent(lesson.getContentUrl());
            logger.debug("Conteúdo removido do Storage");
        } catch (Exception e) {
            logger.warn("Erro ao deletar conteúdo do storage: {}", e.getMessage());
            // Continue with soft delete even if storage deletion fails
        }

        // Soft delete: set deletedAt timestamp
        lesson.setDeletedAt(LocalDateTime.now());
        lessonRepository.save(lesson);

        logger.info("✅ Lição deletada (soft delete): id={}", lessonId);
    }

    @Override
    @Transactional(readOnly = true)
    public String getLessonContentForAdmin(String lessonId) {
        logger.debug("Carregando conteúdo da lição para admin: lessonId={}", lessonId);

        Lesson lesson = findLessonOrThrow(lessonId);

        try {
            String content = storageService.getLessonContent(lesson.getContentUrl());
            logger.debug("Conteúdo carregado do Firebase Storage: lessonId={}, size={}bytes", 
                lessonId, content.length());
            return content;
        } catch (Exception e) {
            logger.error("Erro ao carregar conteúdo do storage: lessonId={}, url={}", 
                lessonId, lesson.getContentUrl(), e);
            throw new BusinessException("Erro ao carregar conteúdo da lição: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getLessonContent(String lessonId) {
        logger.debug("Carregando conteúdo da lição para visualização: lessonId={}", lessonId);

        Lesson lesson = findLessonOrThrow(lessonId);

        try {
            String content = storageService.getLessonContent(lesson.getContentUrl());
            logger.debug("Conteúdo carregado do Firebase Storage: lessonId={}, size={}bytes", 
                lessonId, content.length());
            return content;
        } catch (Exception e) {
            logger.error("Erro ao carregar conteúdo do storage: lessonId={}, url={}", 
                lessonId, lesson.getContentUrl(), e);
            throw new BusinessException("Erro ao carregar conteúdo da lição: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonSummaryDTO> getAllLessonsForAdmin(String courseId, Boolean isDraft) {
        logger.debug("Buscando lições para admin: courseId={}, isDraft={}", courseId, isDraft);

        List<Lesson> lessons = lessonRepository.findAllForAdmin(courseId, isDraft);

        return lessons.stream()
                .map(lesson -> new LessonSummaryDTO(
                        lesson.getId(),
                        lesson.getTitle(),
                        lesson.getCourse().getId(),
                        lesson.getCourse().getTitle(),
                        lesson.getLessonOrder(),
                        lesson.getIsDraft(),
                        lesson.getLastModified()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void updateLessonQuiz(String lessonId, List<QuizCreateDTO> quizDTOs) {
        logger.info("Atualizando quiz da lição: lessonId={}, totalQuestions={}", lessonId, quizDTOs.size());

        // Verify lesson exists
        Lesson lesson = findLessonOrThrow(lessonId);

        // Delete existing quiz questions
        List<Question> existingQuestions = questionRepository.findAllByLessonIdOrderByOrderAsc(lessonId);
        for (Question q : existingQuestions) {
            alternativeRepository.deleteAll(q.getAlternatives());
        }
        questionRepository.deleteAll(existingQuestions);

        logger.debug("Quiz antigo removido: {} questões deletadas", existingQuestions.size());

        // Create new quiz questions
        int order = 1;
        for (QuizCreateDTO dto : quizDTOs) {
            // Validate options
            if (dto.options().size() != 4) {
                throw new BusinessException("Cada questão deve ter exatamente 4 opções");
            }

            // Validate correctAnswer is one of the option letters
            boolean validAnswer = dto.options().stream()
                    .anyMatch(opt -> opt.letter().equals(dto.correctAnswer()));
            if (!validAnswer) {
                throw new BusinessException(
                    "A resposta correta deve ser uma das letras das opções (A, B, C ou D)"
                );
            }

            // Create Question
            Question question = new Question();
            question.setLesson(lesson);
            question.setStatement(dto.question());
            question.setOrder(order++);
            question.setExplanation(dto.explanation());

            questionRepository.save(question);

            // Create Alternatives
            for (QuizOptionDTO optionDTO : dto.options()) {
                Alternative alternative = new Alternative();
                alternative.setQuestion(question);
                alternative.setText(optionDTO.text());
                alternative.setIsCorrect(optionDTO.letter().equals(dto.correctAnswer()));

                alternativeRepository.save(alternative);
            }
        }

        logger.info("✅ Quiz atualizado com sucesso: {} questões criadas", quizDTOs.size());
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

    @Override
    @Transactional(readOnly = true)
    public List<Integer> getOccupiedLessonOrders(String courseId) {
        logger.debug("Buscando ordens de lição ocupadas para o curso: {}", courseId);
        
        List<Lesson> lessons = lessonRepository.findAllByCourseId(courseId);
        
        List<Integer> occupiedOrders = lessons.stream()
                .map(Lesson::getLessonOrder)
                .sorted()
                .toList();
        
        logger.debug("Ordens ocupadas no curso {}: {}", courseId, occupiedOrders);
        
        return occupiedOrders;
    }

    @Override
    @Transactional
    public void reorderLessons(String courseId, List<LessonReorderDTO> reorders) {
        logger.info("Reordenando lições do curso: courseId={}, total={}", courseId, reorders.size());
        
        // Validate course exists
        courseRepository.findById(courseId)
                .orElseThrow(() -> {
                    logger.warn("Curso não encontrado: {}", courseId);
                    return new EntityNotFoundException("Curso não encontrado: " + courseId);
                });
        
        // Update each lesson order
        for (LessonReorderDTO reorder : reorders) {
            Lesson lesson = findLessonOrThrow(reorder.lessonId());
            
            // Verify lesson belongs to the course
            if (!lesson.getCourse().getId().equals(courseId)) {
                logger.warn("Tentativa de reordenar lição de outro curso: lessonId={}, expectedCourse={}, actualCourse={}",
                        reorder.lessonId(), courseId, lesson.getCourse().getId());
                throw new BusinessException("A lição " + reorder.lessonId() + " não pertence ao curso " + courseId);
            }
            
            lesson.setLessonOrder(reorder.newOrder());
            lessonRepository.save(lesson);
            
            logger.debug("Lição reordenada: lessonId={}, newOrder={}", reorder.lessonId(), reorder.newOrder());
        }
        
        logger.info("✅ Reordenação concluída: {} lições atualizadas no curso {}", reorders.size(), courseId);
    }
}
