package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.AdminStatsDTO;
import br.edu.ifsp.prsi.finquest.dto.UserSummaryDTO;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.enums.MissionStatus;
import br.edu.ifsp.prsi.finquest.model.enums.UserRole;
import br.edu.ifsp.prsi.finquest.repository.*;
import br.edu.ifsp.prsi.finquest.service.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final UserRepository userRepository;
    private final UserLessonCompletionRepository lessonCompletionRepository;
    private final UserMissionProgressRepository missionProgressRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            UserLessonCompletionRepository lessonCompletionRepository,
            UserMissionProgressRepository missionProgressRepository
    ) {
        this.userRepository = userRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.missionProgressRepository = missionProgressRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDTO getSystemStats() {
        long totalUsers = userRepository.count();

        // Usuários ativos nos últimos 30 dias (baseado em lesson completion)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        long activeUsers = lessonCompletionRepository.countDistinctUsersByCompletedAtAfter(thirtyDaysAgo);

        long totalLessonsCompleted = lessonCompletionRepository.count();
        long totalMissionsCompleted = missionProgressRepository.countByStatus(MissionStatus.COMPLETED);

        Double avgFinPoints = userRepository.findAverageFinPoints();
        double averageFinPoints = avgFinPoints != null ? avgFinPoints : 0.0;

        Integer maxLevel = userRepository.findMaxLevel();
        int highestLevel = maxLevel != null ? maxLevel : 1;

        logger.info("Estatísticas do sistema solicitadas por admin");

        return new AdminStatsDTO(
                totalUsers,
                activeUsers,
                totalLessonsCompleted,
                totalMissionsCompleted,
                averageFinPoints,
                highestLevel
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);

        return users.map(user -> {
            LocalDate lastActivity = lessonCompletionRepository
                    .findTopByUserIdOrderByCompletedAtDesc(user.getId())
                    .map(completion -> completion.getCompletedAt().toLocalDate())
                    .orElse(null);

            long completedLessons = lessonCompletionRepository.countByUserId(user.getId());

            return new UserSummaryDTO(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getLevel(),
                    user.getTotalFinPoints(),
                    lastActivity,
                    completedLessons
            );
        });
    }

    @Override
    @Transactional
    public void promoteUserToAdmin(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        user.setRole(UserRole.ADMIN);
        userRepository.save(user);

        logger.info("Usuário {} promovido a ADMIN", userId);
    }
}
