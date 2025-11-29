package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.AdminStatsDTO;
import br.edu.ifsp.prsi.finquest.dto.UserSummaryDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserLessonCompletion;
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
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    private static final int ACTIVE_USERS_DAYS_THRESHOLD = 30;

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
        logger.info("Gerando estatisticas do sistema");

        long totalUsers = userRepository.count();
        long activeUsers = countActiveUsers();
        long totalLessonsCompleted = lessonCompletionRepository.count();
        long totalMissionsCompleted = missionProgressRepository.countByStatus(MissionStatus.COMPLETED);
        double averageFinPoints = getAverageFinPoints();
        int highestLevel = getHighestLevel();

        logger.info("Estatisticas geradas: totalUsers={}, activeUsers={}, lessonsCompleted={}, missionsCompleted={}",
                totalUsers, activeUsers, totalLessonsCompleted, totalMissionsCompleted);

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
        logger.debug("Buscando usuarios: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());

        Page<User> users = userRepository.findAll(pageable);

        Page<UserSummaryDTO> result = users.map(this::buildUserSummary);

        logger.debug("Usuarios encontrados: total={}, page={}", result.getTotalElements(), pageable.getPageNumber());

        return result;
    }

    @Transactional
    @Override
    public void promoteUserToAdmin(String targetUserId, String adminUserId) {
        logger.info("Tentativa de promocao: targetUserId={}, requestedBy={}",
                targetUserId, adminUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + targetUserId));

        if (targetUser.getRole() == UserRole.ADMIN) {
            logger.warn("Usuario ja e admin: targetUserId={}", targetUserId);
            throw new BusinessException("Usuario ja possui role ADMIN.");
        }

        targetUser.setRole(UserRole.ADMIN);
        userRepository.save(targetUser);

        logger.info("Usuario promovido a admin: targetUserId={}, promotedBy={}",
                targetUserId, adminUserId);
    }

    private UserSummaryDTO buildUserSummary(User user) {
        LocalDate lastActivity = findLastActivityDate(user.getId());
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
    }

    private LocalDate findLastActivityDate(String userId) {
        List<UserLessonCompletion> completions = lessonCompletionRepository
                .findAllByUserIdOrderByCompletedAtDesc(userId);

        if (completions.isEmpty()) {
            return null;
        }

        return completions.getFirst().getCompletedAt().toLocalDate();
    }

    private long countActiveUsers() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(ACTIVE_USERS_DAYS_THRESHOLD);
        return lessonCompletionRepository.countDistinctUsersByCompletedAtAfter(threshold);
    }

    private double getAverageFinPoints() {
        Double avg = userRepository.findAverageFinPoints();
        return avg != null ? avg : 0.0;
    }

    private int getHighestLevel() {
        Integer maxLevel = userRepository.findMaxLevel();
        return maxLevel != null ? maxLevel : 1;
    }
}