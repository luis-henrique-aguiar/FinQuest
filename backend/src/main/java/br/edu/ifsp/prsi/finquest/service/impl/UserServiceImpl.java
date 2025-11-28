package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.*;
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
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public UserDTO findUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado para o ID: " + id));

        List<UserAchievement> userAchievements = userAchievementRepository.findByIdUserId(id);

        List<UserAchievementDTO> achievementDTOs = userAchievements.stream()
                .map(UserAchievementDTO::new)
                .collect(Collectors.toList());

        return UserDTO.convertToDTOWithAchievements(user, achievementDTOs);
    }

    @Transactional
    public UserDTO updateEmail(String userId, UpdateUserEmailDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        String newEmail = request.email();

        if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new BusinessException("Este email já está cadastrado no sistema.");
        }

        try {
            UserRecord.UpdateRequest firebaseRequest = new UserRecord.UpdateRequest(userId)
                    .setEmail(newEmail)
                    .setEmailVerified(false);

            FirebaseAuth.getInstance().updateUser(firebaseRequest);

            user.setEmail(newEmail);
            User updatedUserEntity = userRepository.save(user);

            return UserDTO.convertToDTO(updatedUserEntity);

        } catch (FirebaseAuthException e) {
            if (e.getErrorCode().equals("email-already-exists")) {
                throw new BusinessException("Este email já está cadastrado no sistema.");
            }

            logger.error("Erro ao atualizar e-mail no Firebase para usuário {}: {}", userId, e.getMessage());
            throw new RuntimeException("Erro interno ao atualizar e-mail.", e);
        }
    }

    @Override
    public UserDTO updateName(String userId, UpdateUserNameDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        user.setName(request.name());

        return UserDTO.convertToDTO(userRepository.save(user));
    }

    @Override
    public void updatePassword(String userId, UpdateUserPasswordDTO request) {
        if (!request.newPassword().equals(request.confirmationPassword())) {
            throw new BusinessException("A nova senha e a confirmação não coincidem.");
        }

        try {
            UserRecord.UpdateRequest firebaseRequest = new UserRecord.UpdateRequest(userId)
                    .setPassword(request.newPassword());

            FirebaseAuth.getInstance().updateUser(firebaseRequest);
            FirebaseAuth.getInstance().revokeRefreshTokens(userId);

            logger.info("Senha e tokens do usuário {} atualizados e revogados via Fluxo Híbrido.", userId);

        } catch (FirebaseAuthException e) {
            logger.error("Erro ao atualizar senha via Admin SDK para usuário {}: {}", userId, e.getMessage());
            throw new RuntimeException("Erro interno ao atualizar senha.");
        }
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
