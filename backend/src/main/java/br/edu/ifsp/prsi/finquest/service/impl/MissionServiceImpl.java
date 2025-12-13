package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.AchievementDTO;
import br.edu.ifsp.prsi.finquest.dto.GoalCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.MissionCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.MissionProgressDTO;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.model.enums.MissionStatus;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.MissionService;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class MissionServiceImpl implements MissionService {

    private static final Logger logger = LoggerFactory.getLogger(MissionServiceImpl.class);

    private final MissionRepository missionRepository;
    private final UserMissionProgressRepository progressRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;

    public MissionServiceImpl(
            MissionRepository missionRepository,
            UserMissionProgressRepository progressRepository,
            UserService userService,
            UserRepository userRepository,
            AchievementRepository achievementRepository
    ) {
        this.missionRepository = missionRepository;
        this.progressRepository = progressRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MissionProgressDTO> getMissionsForUser(String userId) {
        logger.debug("Buscando painel de missões: userId={}", userId);

        validateUserExists(userId);

        List<Mission> allMissions = missionRepository.findAll();
        Map<String, UserMissionProgress> progressMap = buildProgressMap(userId);

        List<MissionProgressDTO> result = allMissions.stream()
                .map(mission -> new MissionProgressDTO(mission, progressMap.get(mission.getId())))
                .toList();

        long completedCount = result.stream()
                .filter(m -> m.getStatus() == MissionStatus.COMPLETED)
                .count();

        logger.debug("Painel carregado: userId={}, totalMissões={}, completadas={}",
                userId, result.size(), completedCount);

        return result;
    }

    @Transactional
    public void processLessonCompletion(String userId, String lessonId) {
        logger.info("Gatilho de Gamificação: LESSON_COMPLETED. userId={}, lessonId={}", userId, lessonId);
        processRelevantMissions(userId, MissionTriggerType.LESSON_COMPLETED);
    }

    @Transactional
    public GoalCompletionDTO processGoalCompletion(String userId, String goalId) {
        logger.info("Gatilho de Gamificação: GOAL_COMPLETED. userId={}, goalId={}", userId, goalId);

        User user = findUserOrThrow(userId);
        int levelBeforeProcessing = user.getLevel();

        processRelevantMissions(userId, MissionTriggerType.GOAL_COMPLETED);

        GoalCompletionDTO result = buildGoalCompletionResult(userId, levelBeforeProcessing);

        if (result.didLevelUp()) {
            logger.info("🎉 LEVEL UP (via Meta)! Usuário {} subiu para o nível {}", userId, result.level());
        }

        return result;
    }

    @Transactional
    public MissionCompletionDTO processTransactionCreation(String userId) {
        logger.info("Gatilho de Gamificação: TRANSACTION_CREATED. userId={}", userId);

        User userBefore = findUserOrThrow(userId);
        int pointsBefore = userBefore.getTotalFinPoints();
        int levelBefore = userBefore.getLevel();

        processRelevantMissions(userId, MissionTriggerType.TRANSACTION_CREATED);

        User userAfter = findUserOrThrow(userId);

        if (!hasUserProgressed(pointsBefore, userAfter.getTotalFinPoints())) {
            logger.debug("Nenhuma recompensa gerada neste gatilho. UserId={}", userId);
            return null;
        }

        return buildTransactionCompletionResult(userAfter, levelBefore);
    }

    private boolean hasUserProgressed(int pointsBefore, int pointsAfter) {
        return pointsAfter > pointsBefore;
    }

    private MissionCompletionDTO buildTransactionCompletionResult(User user, int previousLevel) {
        int currentLevel = user.getLevel();
        boolean leveledUp = currentLevel > previousLevel;
        AchievementDTO unlockedBadge = null;

        if (leveledUp) {
            unlockedBadge = handleLevelUpEvent(user.getId(), currentLevel);
        }

        return new MissionCompletionDTO(
                user.getTotalFinPoints(),
                currentLevel,
                leveledUp,
                unlockedBadge
        );
    }

    private AchievementDTO handleLevelUpEvent(String userId, int currentLevel) {
        logger.info("🎉 LEVEL UP (via Transação)! Usuário {} subiu para o nível {}", userId, currentLevel);

        return achievementRepository.findByRequiredLevel(currentLevel)
                .map(badge -> {
                    logger.info("🏆 Badge de Nível Desbloqueado: {} para userId={}", badge.getTitle(), userId);
                    return new AchievementDTO(badge);
                })
                .orElse(null);
    }

    private void processRelevantMissions(String userId, MissionTriggerType triggerType) {
        List<Mission> relevantMissions = missionRepository.findByTriggerEventType(triggerType);

        if (relevantMissions.isEmpty()) {
            logger.debug("Nenhuma missão configurada para o gatilho {}", triggerType);
            return;
        }

        logger.debug("Processando {} missões do tipo {} para userId={}",
                relevantMissions.size(), triggerType, userId);

        for (Mission mission : relevantMissions) {
            processIndividualMission(userId, mission);
        }
    }

    private void processIndividualMission(String userId, Mission mission) {
        try {
            updateMissionProgress(userId, mission);
        } catch (Exception e) {
            logger.error("Falha ao processar missão '{}' ({}) para userId={}. Erro: {}",
                    mission.getTitle(), mission.getId(), userId, e.getMessage(), e);
        }
    }

    private void updateMissionProgress(String userId, Mission mission) {
        if (!isValidMission(mission)) {
            logger.warn("Missão inválida ignorada: id={}", mission.getId());
            return;
        }

        UserMissionProgress progress = findOrCreateProgress(userId, mission);

        if (progress.isCompleted()) {
            logger.debug("Missão já completada anteriormente: missionId={}, userId={}", mission.getId(), userId);
            return;
        }

        incrementAndCheckCompletion(progress, mission, userId);

        progressRepository.save(progress);
    }

    private boolean isValidMission(Mission mission) {
        return mission.getTargetCount() > 0;
    }

    private UserMissionProgress findOrCreateProgress(String userId, Mission mission) {
        UserMissionProgressId progressId = new UserMissionProgressId(userId, mission.getId());

        return progressRepository.findById(progressId)
                .orElseGet(() -> {
                    logger.debug("Iniciando nova missão para usuário: mission='{}'", mission.getTitle());
                    return createNewProgress(userId, mission, progressId);
                });
    }

    private UserMissionProgress createNewProgress(String userId, Mission mission, UserMissionProgressId progressId) {
        UserMissionProgress newProgress = new UserMissionProgress(progressId);
        newProgress.setUser(userRepository.getReferenceById(userId));
        newProgress.setMission(mission);
        newProgress.setStatus(MissionStatus.NOT_STARTED);
        return newProgress;
    }

    private void incrementAndCheckCompletion(UserMissionProgress progress, Mission mission, String userId) {
        int before = progress.getCurrentCount();
        progress.incrementProgress();
        int after = progress.getCurrentCount();

        logger.info("Progresso de Missão: userId={}, mission='{}', progress={} -> {}/{}",
                userId, mission.getTitle(), before, after, mission.getTargetCount());

        if (progress.hasReachedTarget(mission.getTargetCount())) {
            completeMission(progress, userId, mission);
        }
    }

    private void completeMission(UserMissionProgress progress, String userId, Mission mission) {
        progress.complete();

        logger.info("✅ MISSÃO COMPLETADA: '{}' (ID: {}). Recompensa: +{} FinPoints. UserId={}",
                mission.getTitle(), mission.getId(), mission.getRewardFinPoints(), userId);

        boolean leveledUp = userService.addFinPoints(userId, mission.getRewardFinPoints());

        if (leveledUp) {
            logger.info("A missão '{}' causou um Level Up no userId={}", mission.getTitle(), userId);
        }
    }

    private GoalCompletionDTO buildGoalCompletionResult(String userId, int levelBeforeProcessing) {
        User updatedUser = findUserOrThrow(userId);

        int currentLevel = updatedUser.getLevel();
        boolean leveledUp = currentLevel > levelBeforeProcessing;

        AchievementDTO unlockedBadge = leveledUp
                ? findBadgeForLevel(currentLevel)
                : null;

        return new GoalCompletionDTO(
                updatedUser.getTotalFinPoints(),
                currentLevel,
                leveledUp,
                unlockedBadge
        );
    }

    private AchievementDTO findBadgeForLevel(int level) {
        Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(level);

        if (badgeOpt.isPresent()) {
            return new AchievementDTO(badgeOpt.get());
        }
        return null;
    }

    private void validateUserExists(String userId) {
        if (!userRepository.existsById(userId)) {
            logger.warn("Tentativa de buscar missões para usuário inexistente: {}", userId);
            throw new EntityNotFoundException("Usuario nao encontrado: " + userId);
        }
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + userId));
    }

    private Map<String, UserMissionProgress> buildProgressMap(String userId) {
        List<UserMissionProgress> userProgressList = progressRepository.findAllByIdUserId(userId);

        return userProgressList.stream()
                .collect(Collectors.toMap(
                        progress -> progress.getId().getMissionId(),
                        Function.identity()
                ));
    }
}