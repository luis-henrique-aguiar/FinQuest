package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.MissionProgressDTO;
import br.edu.ifsp.prsi.finquest.events.LessonCompletedEvent;
import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgress;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgressId;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import br.edu.ifsp.prsi.finquest.repository.MissionRepository;
import br.edu.ifsp.prsi.finquest.repository.UserMissionProgressRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.MissionService;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MissionServiceImpl implements MissionService {

    private final MissionRepository missionRepository;
    private final UserMissionProgressRepository progressRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public MissionServiceImpl(MissionRepository missionRepository,
                              UserMissionProgressRepository progressRepository,
                              UserService userService, UserRepository userRepository) {
        this.missionRepository = missionRepository;
        this.progressRepository = progressRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * Este método "ouve" por eventos LessonCompletedEvent e é executado automaticamente.
     */
    @EventListener
    @Transactional
    public void handleLessonCompleted(LessonCompletedEvent event) {
        String userId = event.getUserId();
        List<Mission> relevantMissions = missionRepository.findByTriggerEventType(MissionTriggerType.LESSON_COMPLETED);
        for (Mission mission : relevantMissions) {
            updateMissionProgress(userId, mission);
        }
    }

    @Transactional(readOnly = true)
    public List<MissionProgressDTO> getMissionsForUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        List<Mission> allMissions = missionRepository.findAll();

        List<UserMissionProgress> userProgressList = progressRepository.findAllByIdUserId(userId);

        Map<String, UserMissionProgress> progressMap = userProgressList.stream()
                .collect(Collectors.toMap(
                        progress -> progress.getId().getMissionId(),
                        progress -> progress
                ));

        return allMissions.stream()
                .map(mission -> new MissionProgressDTO(
                        mission,
                        progressMap.get(mission.getId())
                ))
                .collect(Collectors.toList());
    }

    /**
     * Lógica principal de atualização de progresso da missão.
     */
    private void updateMissionProgress(String userId, Mission mission) {
        UserMissionProgressId progressId = new UserMissionProgressId(userId, mission.getId());

        UserMissionProgress progress = progressRepository.findById(progressId)
                .orElse(new UserMissionProgress(progressId));

        if ("COMPLETED".equals(progress.getStatus())) {
            return;
        }

        progress.setCurrentCount(progress.getCurrentCount() + 1);

        if (progress.getCurrentCount() >= mission.getTargetCount()) {
            progress.setStatus("COMPLETED");
            userService.addFinPoints(userId, mission.getRewardFinPoints());
        }

        progressRepository.save(progress);
    }
}
