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

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final FirebaseAuth firebaseAuth;

    public UserServiceImpl(
            UserRepository userRepository,
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository,
            FirebaseAuth firebaseAuth
    ) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO findUserById(String id){
        logger.debug("Buscando perfil completo do usuário: userId={}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Tentativa de acesso a perfil inexistente: userId={}", id);
                    return new EntityNotFoundException("Usuário não encontrado para o ID: " + id);
                });

        List<UserAchievement> userAchievements = userAchievementRepository.findByIdUserId(id);

        List<UserAchievementDTO> achievementDTOs = userAchievements.stream()
                .map(UserAchievementDTO::new)
                .toList();

        logger.debug("Perfil recuperado com sucesso: userId={}, conquistas={}", id, achievementDTOs.size());
        return UserDTO.convertToDTOWithAchievements(user, achievementDTOs);
    }

    @Transactional
    @Override
    public UserDTO updateAvatar(String userId, String avatarUrl) {
        logger.info("Solicitação de atualização de avatar: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + userId));

        user.setAvatarUrl(avatarUrl);
        User savedUser = userRepository.save(user);

        logger.info("Avatar atualizado e persistido com sucesso: userId={}", userId);

        return UserDTO.convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO updateEmail(String userId, UpdateUserEmailDTO request) {
        logger.info("Iniciando processo de alteração de e-mail: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        String newEmail = request.email();

        if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            logger.warn("Tentativa de uso de e-mail já existente: userId={}, email={}", userId, newEmail);
            throw new BusinessException("Este email já está cadastrado no sistema.");
        }

        try {
            UserRecord.UpdateRequest firebaseRequest = new UserRecord.UpdateRequest(userId)
                    .setEmail(newEmail)
                    .setEmailVerified(false);

            this.firebaseAuth.updateUser(firebaseRequest);
            logger.debug("E-mail atualizado no Firebase: userId={}", userId);

            user.setEmail(newEmail);
            User updatedUserEntity = userRepository.save(user);

            logger.info("E-mail atualizado com sucesso no sistema local e remoto: userId={}", userId);
            return UserDTO.convertToDTO(updatedUserEntity);

        } catch (FirebaseAuthException e) {
            if (e.getErrorCode().equals("email-already-exists")) {
                logger.warn("Conflito de e-mail no Firebase: userId={}, email={}", userId, newEmail);
                throw new BusinessException("Este email já está cadastrado no sistema.");
            }

            logger.error("Erro crítico ao atualizar e-mail no Firebase: userId={}, error={}", userId, e.getMessage(), e);
            throw new RuntimeException("Erro interno ao atualizar e-mail.", e);
        }
    }

    @Override
    public UserDTO updateName(String userId, UpdateUserNameDTO request) {
        logger.info("Atualizando nome de exibição: userId={}, novoNome='{}'", userId, request.name());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        user.setName(request.name());
        User saved = userRepository.save(user);

        logger.debug("Nome atualizado no banco: userId={}", userId);
        return UserDTO.convertToDTO(saved);
    }

    @Override
    public List<AchievementStatusDTO> getAllAchievementsWithStatus(String userId) {
        logger.debug("Buscando status de todas as conquistas para: userId={}", userId);

        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("Usuário não encontrado.");
        }

        List<AchievementStatusDTO> achievements = achievementRepository.findAllWithStatusByUserId(userId);

        long unlockedCount = achievements.stream().filter(AchievementStatusDTO::isUnlocked).count();
        logger.debug("Conquistas retornadas: total={}, desbloqueadas={}", achievements.size(), unlockedCount);

        return achievements;
    }

    @Override
    public void updatePassword(String userId, UpdateUserPasswordDTO request) {
        logger.info("Iniciando fluxo de alteração de senha: userId={}", userId);

        if (!request.newPassword().equals(request.confirmationPassword())) {
            logger.warn("Falha na validação de senha: confirmação não confere. userId={}", userId);
            throw new BusinessException("A nova senha e a confirmação não coincidem.");
        }

        try {
            UserRecord.UpdateRequest firebaseRequest = new UserRecord.UpdateRequest(userId)
                    .setPassword(request.newPassword());

            this.firebaseAuth.updateUser(firebaseRequest);
            this.firebaseAuth.revokeRefreshTokens(userId);

            logger.info("Senha atualizada e tokens revogados com sucesso (Logout forçado): userId={}", userId);
        } catch (FirebaseAuthException e) {
            logger.error("Falha ao atualizar senha no Firebase Admin SDK: userId={}, error={}",
                    userId, e.getMessage(), e);
            throw new RuntimeException("Erro interno ao atualizar senha.");
        }
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

        logger.info("Progresso atualizado: userId={}, pontos={}(+{}), nivel={}",
                userId, newTotalPoints, points, newLevel);

        if (leveledUp) {
            logger.info("\uD83C\uDF89 LEVEL UP! Usuário {} subiu do nível {} para o {}",
                    userId, previousLevel, newLevel);
            handleLevelUp(userId, previousLevel, newLevel);
        }

        return leveledUp;
    }

    private void handleLevelUp(String userId, int previousLevel, int newLevel) {
        checkAndGrantLevelBadge(userId, newLevel);
    }

    private void checkAndGrantLevelBadge(String userId, int level) {
        Optional<Achievement> badgeOpt = achievementRepository.findByRequiredLevel(level);

        if (badgeOpt.isEmpty()) {
            logger.debug("Nenhum badge configurado para o nível {}", level);
            return;
        }

        Achievement badge = badgeOpt.get();

        if (userAlreadyHasBadge(userId, badge.getId())) {
            logger.debug("Usuário {} já possui o badge '{}' (Nível {})", userId, badge.getTitle(), level);
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

        logger.info("BADGE CONCEDIDO: userId={}, badge='{}', icon={}",
                userId, badge.getTitle(), badge.getIcon());
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("Erro de integridade: Tentativa de operação em usuário inexistente: {}", userId);
                    return new EntityNotFoundException("Usuario nao encontrado: " + userId);
                });
    }
}