package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.UserDTO;
import br.edu.ifsp.prsi.finquest.model.Achievement;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserAchievement;
import br.edu.ifsp.prsi.finquest.model.UserAchievementId;
import br.edu.ifsp.prsi.finquest.repository.AchievementRepository;
import br.edu.ifsp.prsi.finquest.repository.UserAchievementRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.UserService;
import br.edu.ifsp.prsi.finquest.utils.LevelingSystem;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository
    ) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @Override
    public UserDTO findUserById(String id) {
        logger.debug("Buscando usuario: userId={}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + id));

        return UserDTO.convertToDTO(user);
    }

    @Override
    @Transactional
    public boolean addFinPoints(String userId, int points) {
        logger.debug("Adicionando FinPoints: userId={}, points={}", userId, points);

        User user = findUserOrThrow(userId);

        int previousLevel = user.getLevel();
        int previousPoints = user.getTotalFinPoints();

        int newTotalPoints = previousPoints + points;
        int newLevel = LevelingSystem.calculateLevel(newTotalPoints);

        user.setTotalFinPoints(newTotalPoints);
        user.setLevel(newLevel);
        userRepository.save(user);

        boolean leveledUp = newLevel > previousLevel;

        logger.info("FinPoints atualizados: userId={}, pointsAdded={}, totalPoints={}, level={} -> {}",
                userId, points, newTotalPoints, previousLevel, newLevel);

        if (leveledUp) {
            handleLevelUp(userId, previousLevel, newLevel);
        }

        return leveledUp;
    }

    private void handleLevelUp(String userId, int previousLevel, int newLevel) {
        logger.info("Level up detectado: userId={}, previousLevel={}, newLevel={}",
                userId, previousLevel, newLevel);

        checkAndGrantLevelBadge(userId, newLevel);
    }

    private void checkAndGrantLevelBadge(String userId, int level) {
        Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(level);

        if (badgeOpt.isEmpty()) {
            logger.debug("Nenhum badge configurado para o nivel: level={}", level);
            return;
        }

        Achievement badge = badgeOpt.get();

        if (userAlreadyHasBadge(userId, badge.getId())) {
            logger.debug("Usuario ja possui o badge: userId={}, badgeId={}, badgeTitle='{}'",
                    userId, badge.getId(), badge.getTitle());
            return;
        }

        grantBadgeToUser(userId, badge);
    }

    private boolean userAlreadyHasBadge(String userId, Long badgeId) {
        UserAchievementId achievementId = new UserAchievementId(userId, badgeId);
        return userAchievementRepository.existsById(achievementId);
    }

    private void grantBadgeToUser(String userId, Achievement badge) {
        UserAchievementId achievementId = new UserAchievementId(userId, badge.getId());
        User user = userRepository.getReferenceById(userId);

        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setId(achievementId);
        userAchievement.setDate(LocalDate.now());
        userAchievement.setUser(user);
        userAchievement.setAchievement(badge);

        userAchievementRepository.save(userAchievement);

        logger.info("Badge concedido: userId={}, badgeId={}, badgeTitle='{}', requiredLevel={}",
                userId, badge.getId(), badge.getTitle(), badge.getRequiredLevel());
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + userId));
    }
}