package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.MissionProgressDTO;
import br.edu.ifsp.prsi.finquest.events.LessonCompletedEvent;
import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgress;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgressId;
import br.edu.ifsp.prsi.finquest.model.enums.MissionStatus;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import br.edu.ifsp.prsi.finquest.repository.MissionRepository;
import br.edu.ifsp.prsi.finquest.repository.UserMissionProgressRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
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
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class MissionServiceImpl implements MissionService {

    private static final Logger logger = LoggerFactory.getLogger(MissionServiceImpl.class);

    private final MissionRepository missionRepository;
    private final UserMissionProgressRepository progressRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public MissionServiceImpl(
            MissionRepository missionRepository,
            UserMissionProgressRepository progressRepository,
            UserService userService,
            UserRepository userRepository
    ) {
        this.missionRepository = missionRepository;
        this.progressRepository = progressRepository;
        this.userService = userService;
        this.userRepository = userRepository;
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