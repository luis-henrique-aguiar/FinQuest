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
        logger.debug("Buscando missoes para o usuario: userId={}", userId);

        validateUserExists(userId);

        List<Mission> allMissions = missionRepository.findAll();
        Map<String, UserMissionProgress> progressMap = buildProgressMap(userId);

        List<MissionProgressDTO> result = allMissions.stream()
                .map(mission -> new MissionProgressDTO(mission, progressMap.get(mission.getId())))
                .toList();

        logger.debug("Retornando {} missoes para o usuario: userId={}", result.size(), userId);

        return result;
    }

    @Transactional
    public void processLessonCompletion(String userId, String lessonId) {
        logger.info("Processando conclusao de licao: userId={}, lessonId={}", userId, lessonId);

        processRelevantMissions(userId, MissionTriggerType.LESSON_COMPLETED);

        logger.info("Processamento de missoes concluido: userId={}", userId);
    }

    @Transactional
    public GoalCompletionDTO processGoalCompletion(String userId, String goalId) {
        logger.info("Processando conclusao de meta: userId={}, goalId={}", userId, goalId);

        User user = findUserOrThrow(userId);
        int levelBeforeProcessing = user.getLevel();

        processRelevantMissions(userId, MissionTriggerType.GOAL_COMPLETED);

        GoalCompletionDTO result = buildGoalCompletionResult(userId, levelBeforeProcessing);

        logger.info("Processamento de meta concluido: userId={}, levelUp={}",
                userId, result.didLevelUp());

        return result;
    }

    @Transactional
    public MissionCompletionDTO processTransactionCreation(String userId) {
        logger.info("Processando criacao de transacao para missoes. UserId={}", userId);

        User userBefore = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + userId));

        int levelBefore = userBefore.getLevel();
        int pointsBefore = userBefore.getTotalFinPoints();

        // Processa missoes do tipo TRANSACTION_CREATED
        processRelevantMissions(userId, MissionTriggerType.TRANSACTION_CREATED);

        // Recarrega usuario para verificar mudancas
        User userAfter = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + userId));

        // Se nao houve mudanca nos pontos, nenhuma missao foi completada
        if (userAfter.getTotalFinPoints() == pointsBefore) {
            logger.debug("Nenhuma missao completada com a transacao. UserId={}", userId);
            return null;
        }

        // Calcula resultado
        int finalLevel = userAfter.getLevel();
        boolean leveledUp = finalLevel > levelBefore;

        AchievementDTO unlockedBadge = null;
        if (leveledUp) {
            Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(finalLevel);
            if (badgeOpt.isPresent()) {
                Achievement badge = badgeOpt.get();
                unlockedBadge = new AchievementDTO(badge);
                logger.info("Badge desbloqueado: {} - {}", badge.getTitle(), badge.getIcon());
            }
        }

        logger.info("Missao completada por transacao. UserId={}, LevelUp={}, NewLevel={}",
                userId, leveledUp, finalLevel);

        return new MissionCompletionDTO(
                userAfter.getTotalFinPoints(),
                finalLevel,
                leveledUp,
                unlockedBadge
        );
    }


    private void processRelevantMissions(String userId, MissionTriggerType triggerType) {
        List<Mission> relevantMissions = missionRepository.findByTriggerEventType(triggerType);

        logger.debug("Encontradas {} missoes do tipo {}: userId={}",
                relevantMissions.size(), triggerType, userId);

        for (Mission mission : relevantMissions) {
            processIndividualMission(userId, mission);
        }
    }

    private void processIndividualMission(String userId, Mission mission) {
        try {
            updateMissionProgress(userId, mission);
        } catch (Exception e) {
            logger.error("Erro ao atualizar progresso da missao: missionId={}, userId={}, error={}",
                    mission.getId(), userId, e.getMessage(), e);
        }
    }

    private void updateMissionProgress(String userId, Mission mission) {
        if (!isValidMission(mission)) {
            return;
        }

        UserMissionProgress progress = findOrCreateProgress(userId, mission);

        if (progress.isCompleted()) {
            logger.debug("Missao ja completada, ignorando: missionId={}, userId={}",
                    mission.getId(), userId);
            return;
        }

        incrementAndCheckCompletion(progress, mission, userId);

        progressRepository.save(progress);
    }

    private boolean isValidMission(Mission mission) {
        if (mission.getTargetCount() <= 0) {
            logger.warn("Missao com targetCount invalido, ignorando: missionId={}, targetCount={}",
                    mission.getId(), mission.getTargetCount());
            return false;
        }
        return true;
    }

    private UserMissionProgress findOrCreateProgress(String userId, Mission mission) {
        UserMissionProgressId progressId = new UserMissionProgressId(userId, mission.getId());

        return progressRepository.findById(progressId)
                .orElseGet(() -> createNewProgress(userId, mission, progressId));
    }

    private UserMissionProgress createNewProgress(String userId, Mission mission, UserMissionProgressId progressId) {
        logger.debug("Criando novo progresso: userId={}, missionId={}", userId, mission.getId());

        UserMissionProgress newProgress = new UserMissionProgress(progressId);
        newProgress.setUser(userRepository.getReferenceById(userId));
        newProgress.setMission(mission);
        newProgress.setStatus(MissionStatus.NOT_STARTED);

        return newProgress;
    }

    private void incrementAndCheckCompletion(UserMissionProgress progress, Mission mission, String userId) {
        progress.incrementProgress();

        logger.debug("Progresso atualizado: missionId={}, userId={}, progresso={}/{}",
                mission.getId(), userId, progress.getCurrentCount(), mission.getTargetCount());

        if (progress.hasReachedTarget(mission.getTargetCount())) {
            completeMission(progress, userId, mission);
        }
    }

    private void completeMission(UserMissionProgress progress, String userId, Mission mission) {
        progress.complete();

        logger.info("Missao completada: missionId={}, missionTitle='{}', userId={}",
                mission.getId(), mission.getTitle(), userId);

        boolean leveledUp = userService.addFinPoints(userId, mission.getRewardFinPoints());

        logger.info("Recompensa concedida: finPoints={}, levelUp={}, userId={}",
                mission.getRewardFinPoints(), leveledUp, userId);
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
            Achievement badge = badgeOpt.get();
            logger.info("Badge desbloqueado: level={}, badgeTitle='{}'", level, badge.getTitle());
            return new AchievementDTO(badge);
        }

        logger.warn("Nenhum badge encontrado para o nivel: level={}", level);
        return null;
    }

    private void validateUserExists(String userId) {
        if (!userRepository.existsById(userId)) {
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