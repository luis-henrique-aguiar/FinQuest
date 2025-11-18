package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.AchievementDTO;
import br.edu.ifsp.prsi.finquest.dto.GoalCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.LessonCompletionDTO;
import br.edu.ifsp.prsi.finquest.dto.MissionProgressDTO;
import br.edu.ifsp.prsi.finquest.events.GoalCompletedEvent;
import br.edu.ifsp.prsi.finquest.events.LessonCompletedEvent;
import br.edu.ifsp.prsi.finquest.model.*;
import br.edu.ifsp.prsi.finquest.model.enums.MissionStatus;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.MissionService;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
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
    private final GoalRepository goalRepository;
    private final AchievementRepository achievementRepository;

    public MissionServiceImpl(
            MissionRepository missionRepository,
            UserMissionProgressRepository progressRepository,
            UserService userService,
            UserRepository userRepository,
            GoalRepository goalRepository,
            AchievementRepository achievementRepository
    ) {
        this.missionRepository = missionRepository;
        this.progressRepository = progressRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.goalRepository = goalRepository;
        this.achievementRepository = achievementRepository;
    }

    /**
     * Ouve eventos de conclusão de lição e atualiza o progresso das missões relacionadas.
     */
    @EventListener
    @Transactional
    public void handleLessonCompleted(LessonCompletedEvent event) {
        String userId = event.getUserId();
        String lessonId = event.getLessonId();

        logger.info("Processando evento de conclusão de lição. UserId={}, LessonId={}", userId, lessonId);

        List<Mission> relevantMissions = missionRepository.findByTriggerEventType(MissionTriggerType.LESSON_COMPLETED);

        logger.debug("Encontradas {} missões relacionadas ao tipo LESSON_COMPLETED", relevantMissions.size());

        for (Mission mission : relevantMissions) {
            try {
                updateMissionProgress(userId, mission);
            } catch (Exception e) {
                logger.error("Erro ao atualizar progresso da missão {} para o usuário {}: {}",
                        mission.getId(), userId, e.getMessage(), e);
            }
        }

        logger.info("Processamento de missões concluído para userId={}", userId);
    }

    //@EventListener
    @Transactional
    public GoalCompletionDTO handleGoalCompleted(GoalCompletedEvent event) {
        String userId = event.getUserId();
        String goalId = event.getGoalId();

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new EntityNotFoundException("Meta não encontrada: " + goalId));

        User userBeforeAnything = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        int levelBeforeGoal = userBeforeAnything.getLevel();
        int pointsBeforeGoal = userBeforeAnything.getTotalFinPoints();

        logger.info("📊 ANTES - Nível: {}, Pontos: {}", levelBeforeGoal, pointsBeforeGoal);

        logger.info("Processando evento de conclusão de meta. UserId={}, GoalId={}", userId, goalId);

        List<Mission> relevantMissions = missionRepository.findByTriggerEventType(MissionTriggerType.GOAL_COMPLETED);

        logger.debug("Encontradas {} missões relacionadas ao tipo LESSON_COMPLETED", relevantMissions.size());

        for (Mission mission : relevantMissions) {
            try {
                updateMissionProgress(userId, mission);
            } catch (Exception e) {
                logger.error("Erro ao atualizar progresso da missão {} para o usuário {}: {}",
                        mission.getId(), userId, e.getMessage(), e);
            }
        }

        User updatedUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        int finalLevel = updatedUser.getLevel();
        int finalPoints = updatedUser.getTotalFinPoints();

        logger.info("📊 DEPOIS - Nível: {}, Pontos: {}", finalLevel, finalPoints);

        boolean actuallyLeveledUp = finalLevel > levelBeforeGoal;

        logger.info("🎯 Detecção de Level Up: {} → {} = {}",
                levelBeforeGoal, finalLevel, actuallyLeveledUp);

        AchievementDTO unlockedBadge = null;
        if (actuallyLeveledUp) {
            logger.info("🔍 Buscando badge para o nível final {}", finalLevel);

            Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(finalLevel);

            if (badgeOpt.isPresent()) {
                Achievement badge = badgeOpt.get();
                unlockedBadge = new AchievementDTO(badge);
                logger.info("✅ Badge encontrado: {} - {}", badge.getTitle(), badge.getIcon());
            } else {
                logger.warn("⚠️ Nenhum badge encontrado para o nível {}", finalLevel);
            }
        }

        logger.info("Processamento de missões concluído para userId={}", userId);

        return new GoalCompletionDTO(
                updatedUser.getTotalFinPoints(),
                updatedUser.getLevel(),
                actuallyLeveledUp,
                unlockedBadge
        );
    }

    /**
     * Retorna todas as missões e o progresso do usuário em cada uma delas.
     */
    @Transactional(readOnly = true)
    public List<MissionProgressDTO> getMissionsForUser(String userId) {
        logger.debug("Buscando missões para o usuário: {}", userId);

        userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        List<Mission> allMissions = missionRepository.findAll();
        List<UserMissionProgress> userProgressList = progressRepository.findAllByIdUserId(userId);

        Map<String, UserMissionProgress> progressMap = userProgressList.stream()
                .collect(Collectors.toMap(
                        progress -> progress.getId().getMissionId(),
                        Function.identity()
                ));

        List<MissionProgressDTO> result = allMissions.stream()
                .map(mission -> new MissionProgressDTO(mission, progressMap.get(mission.getId())))
                .toList();

        logger.debug("Retornando {} missões para o usuário {}", result.size(), userId);

        return result;
    }

    /**
     * Atualiza o progresso de uma missão específica para um usuário.
     * Se a missão for completada, concede os FinPoints de recompensa.
     */
    @Transactional
    private void updateMissionProgress(String userId, Mission mission) {
        if (mission.getTargetCount() <= 0) {
            logger.warn("Missão {} possui targetCount inválido: {}. Operação ignorada.",
                    mission.getId(), mission.getTargetCount());
            return;
        }

        UserMissionProgressId progressId = new UserMissionProgressId(userId, mission.getId());

        UserMissionProgress progress = progressRepository.findById(progressId)
                .orElseGet(() -> createNewProgress(userId, mission));

        if (progress.isCompleted()) {
            logger.debug("Missão {} já foi completada pelo usuário {}. Ignorando atualização.",
                    mission.getId(), userId);
            return;
        }

        progress.incrementProgress();

        logger.debug("Progresso da missão {} para o usuário {}: {}/{}",
                mission.getId(), userId, progress.getCurrentCount(), mission.getTargetCount());

        if (progress.hasReachedTarget(mission.getTargetCount())) {
            completeMission(progress, userId, mission);
        }

        progressRepository.save(progress);
    }

    /**
     * Cria um novo registro de progresso para uma missão.
     */
    private UserMissionProgress createNewProgress(String userId, Mission mission) {
        logger.debug("Criando novo progresso para userId={}, missionId={}", userId, mission.getId());

        UserMissionProgressId progressId = new UserMissionProgressId(userId, mission.getId());
        UserMissionProgress newProgress = new UserMissionProgress(progressId);
        newProgress.setUser(userRepository.getReferenceById(userId));
        newProgress.setMission(mission);
        newProgress.setStatus(MissionStatus.NOT_STARTED);

        return newProgress;
    }

    /**
     * Marca a missão como completada e concede a recompensa de FinPoints.
     * O UserService automaticamente concede badges se o usuário subir de nível.
     */
    private void completeMission(UserMissionProgress progress, String userId, Mission mission) {
        progress.complete();

        logger.info("Usuário {} completou a missão '{}' (ID: {})",
                userId, mission.getTitle(), mission.getId());

        boolean leveledUp = userService.addFinPoints(userId, mission.getRewardFinPoints());

        logger.info("Recompensa concedida: {} FinPoints. Level up: {}",
                mission.getRewardFinPoints(), leveledUp);
    }
}