package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.RegisterRequestDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterResponseDTO;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.enums.UserRole;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.AuthService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final FirebaseAuth firebaseAuth;

    public AuthServiceImpl(UserRepository userRepository, FirebaseAuth firebaseAuth) {
        this.userRepository = userRepository;
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        logger.info("Iniciando registro de usuario: email={}", request.email());

        validateEmailNotInUse(request.email());

        UserRecord firebaseUser = null;

        try {
            firebaseUser = createFirebaseUser(request);
            User savedUser = createLocalUser(firebaseUser, request);

            logger.info("Usuario registrado com sucesso: userId={}, email={}",
                    savedUser.getId(), savedUser.getEmail());

            return new RegisterResponseDTO(
                    firebaseUser.getUid(),
                    request.name(),
                    request.email()
            );

        } catch (FirebaseAuthException e) {
            handleFirebaseError(firebaseUser, e);
            throw new BusinessException("Erro ao criar usuario: " + e.getMessage());

        } catch (Exception e) {
            handleUnexpectedError(firebaseUser, e);
            throw new BusinessException("Erro ao registrar usuario.");
        }
    }

    private void validateEmailNotInUse(String email) {
        if (userRepository.existsByEmail(email)) {
            logger.warn("Tentativa de registro com email ja cadastrado: email={}", email);
            throw new BusinessException("Email ja cadastrado.");
        }
    }

    private UserRecord createFirebaseUser(RegisterRequestDTO request) throws FirebaseAuthException {
        UserRecord.CreateRequest firebaseRequest = new UserRecord.CreateRequest()
                .setEmail(request.email())
                .setPassword(request.password())
                .setDisplayName(request.name())
                .setEmailVerified(false);

        UserRecord firebaseUser = firebaseAuth.createUser(firebaseRequest);

        logger.debug("Usuario criado no Firebase: firebaseUid={}", firebaseUser.getUid());

        return firebaseUser;
    }

    private User createLocalUser(UserRecord firebaseUser, RegisterRequestDTO request) {
        User newUser = new User();
        newUser.setId(firebaseUser.getUid());
        newUser.setEmail(request.email());
        newUser.setName(request.name());
        newUser.setBudget(BigDecimal.ZERO);
        newUser.setAvatarUrl(null);
        newUser.setTotalFinPoints(0);
        newUser.setLevel(1);
        newUser.setRole(UserRole.USER);

        User savedUser = userRepository.save(newUser);

        logger.debug("Usuario criado no banco local: userId={}", savedUser.getId());

        return savedUser;
    }

    private void handleFirebaseError(UserRecord firebaseUser, FirebaseAuthException e) {
        logger.error("Erro ao criar usuario no Firebase: error={}", e.getMessage());

        if (firebaseUser != null) {
            rollbackFirebaseUser(firebaseUser.getUid());
        }
    }

    private void handleUnexpectedError(UserRecord firebaseUser, Exception e) {
        logger.error("Erro inesperado no registro: error={}", e.getMessage(), e);

        if (firebaseUser != null) {
            rollbackFirebaseUser(firebaseUser.getUid());
            rollbackLocalUser(firebaseUser.getUid());
        }
    }

    private void rollbackFirebaseUser(String firebaseUid) {
        try {
            firebaseAuth.deleteUser(firebaseUid);
            logger.info("Rollback Firebase executado: firebaseUid={}", firebaseUid);
        } catch (FirebaseAuthException deleteError) {
            logger.error("Erro no rollback do Firebase: firebaseUid={}, error={}",
                    firebaseUid, deleteError.getMessage());
        }
    }

    private void rollbackLocalUser(String userId) {
        try {
            userRepository.deleteById(userId);
            logger.info("Rollback banco local executado: userId={}", userId);
        } catch (Exception deleteError) {
            logger.error("Erro no rollback do banco local: userId={}, error={}",
                    userId, deleteError.getMessage());
        }
    }
}