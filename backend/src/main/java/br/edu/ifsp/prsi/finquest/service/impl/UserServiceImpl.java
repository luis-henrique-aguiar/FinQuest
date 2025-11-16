package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
            UserAchievementRepository userAchievementRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @Override
    @Transactional
    public UserDTO registerUser(RegisterUserDTO registerUserDTO) {
        if (userRepository.findById(registerUserDTO.id()).isPresent()) {
            throw new BusinessException("Usuário com ID: " + registerUserDTO.id() + " já está cadastrado.");
        }

        if (userRepository.existsByEmail(registerUserDTO.email())) {
            throw new BusinessException("Email já cadastrado.");
        }

        User newUser = new User();
        newUser.setId(registerUserDTO.id());
        newUser.setBudget(BigDecimal.ZERO);
        newUser.setAvatarUrl(null);
        newUser.setTotalFinPoints(0);
        newUser.setEmail(registerUserDTO.email());
        newUser.setName(registerUserDTO.name());
        newUser.setLevel(1);

        User savedUser = userRepository.save(newUser);
        return UserDTO.convertToDTO(savedUser);
    }

    public UserDTO findUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado para o ID: " + id));
        return UserDTO.convertToDTO(user);
    }

    @Transactional
    public boolean addFinPoints(String userId, int points) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        int oldLevel = user.getLevel();
        int oldFinPoints = user.getTotalFinPoints();

        user.setTotalFinPoints(oldFinPoints + points);

        int newLevel = LevelingSystem.calculateLevel(user.getTotalFinPoints());
        user.setLevel(newLevel);

        userRepository.save(user);

        boolean didLevelUp = newLevel > oldLevel;

        logger.info("Usuário {} ganhou {} FinPoints. Total: {}. Nível: {} → {}",
                userId, points, user.getTotalFinPoints(), oldLevel, newLevel);

        if (didLevelUp) {
            logger.info("Usuário {} subiu de nível! {} → {}", userId, oldLevel, newLevel);
            checkAndGrantLevelBadge(userId, newLevel);
        }

        return didLevelUp;
    }

    private void checkAndGrantLevelBadge(String userId, int level) {
        Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(level);

        if (badgeOpt.isEmpty()) {
            logger.debug("Nenhum badge encontrado para o nível {}", level);
            return;
        }

        Achievement badge = badgeOpt.get();

        UserAchievementId achievementId = new UserAchievementId(userId, badge.getId());
        if (userAchievementRepository.existsById(achievementId)) {
            logger.debug("Usuário {} já possui o badge '{}' (nível {})", userId, badge.getTitle(), level);
            return;
        }

        User user = userRepository.getReferenceById(userId);

        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setId(achievementId);
        userAchievement.setDate(LocalDate.now());
        userAchievement.setUser(user);
        userAchievement.setAchievement(badge);

        userAchievementRepository.save(userAchievement);

        logger.info("Badge '{}' ({}) concedido ao usuário {} por atingir o nível {}",
                badge.getTitle(), badge.getIcon(), userId, level);
    }
}
