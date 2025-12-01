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
        logger.info("Iniciando processo de registro: email='{}', nome='{}'", request.email(), request.name());

        validateEmailNotInUse(request.email());

        UserRecord firebaseUser = null;

        try {
            logger.debug("Passo 1/2: Criando usuário no Firebase Auth...");
            firebaseUser = createFirebaseUser(request);

            logger.debug("Passo 2/2: Persistindo usuário no banco local...");
            User savedUser = createLocalUser(firebaseUser, request);

            logger.info("Usuário registrado com sucesso! userId={}, firebaseUid={}, email={}",
                    savedUser.getId(), firebaseUser.getUid(), savedUser.getEmail());

            return new RegisterResponseDTO(
                    firebaseUser.getUid(),
                    request.name(),
                    request.email()
            );

        } catch (FirebaseAuthException e) {
            logger.error("Falha na integração com Firebase: code={}, msg={}", e.getErrorCode(), e.getMessage());
            handleFirebaseError(firebaseUser, e);
            throw new BusinessException("Erro ao criar usuario: " + e.getMessage());

        } catch (Exception e) {
            logger.error("Erro crítico inesperado durante o registro: {}", e.getMessage(), e);
            handleUnexpectedError(firebaseUser, e);
            throw new BusinessException("Erro ao registrar usuario.");
        }
    }

    private void validateEmailNotInUse(String email) {
        if (userRepository.existsByEmail(email)) {
            logger.warn("Bloqueio de Registro: Tentativa de uso de e-mail já cadastrado. Email={}", email);
            throw new BusinessException("Email ja cadastrado.");
        }
    }

    private UserRecord createFirebaseUser(RegisterRequestDTO request) throws FirebaseAuthException {
        long startTime = System.currentTimeMillis();

        UserRecord.CreateRequest firebaseRequest = new UserRecord.CreateRequest()
                .setEmail(request.email())
                .setPassword(request.password())
                .setDisplayName(request.name())
                .setEmailVerified(false);

        UserRecord firebaseUser = firebaseAuth.createUser(firebaseRequest);

        logger.debug("Usuário criado no Firebase em {}ms. UID: {}",
                (System.currentTimeMillis() - startTime), firebaseUser.getUid());

        return firebaseUser;
    }

    private User createLocalUser(UserRecord firebaseUser, RegisterRequestDTO request) {
        User newUser = new User();
        newUser.setId(firebaseUser.getUid());
        newUser.setEmail(request.email());
        newUser.setName(request.name());
        newUser.setAvatarUrl(null);
        newUser.setTotalFinPoints(0);
        newUser.setLevel(1);
        newUser.setRole(UserRole.USER);

        User savedUser = userRepository.save(newUser);
        logger.debug("Usuário salvo no MySQL. ID: {}", savedUser.getId());

        return savedUser;
    }

    private void handleFirebaseError(UserRecord firebaseUser, FirebaseAuthException e) {
        if (firebaseUser != null) {
            logger.warn("Iniciando compensação (Rollback) por erro no Firebase...");
            rollbackFirebaseUser(firebaseUser.getUid());
        }
    }

    private void handleUnexpectedError(UserRecord firebaseUser, Exception e) {
        if (firebaseUser != null) {
            logger.warn("Iniciando compensação completa (Rollback) por erro inesperado...");
            rollbackFirebaseUser(firebaseUser.getUid());
            rollbackLocalUser(firebaseUser.getUid());
        }
    }

    private void rollbackFirebaseUser(String firebaseUid) {
        try {
            firebaseAuth.deleteUser(firebaseUid);
            logger.info("🔄 Rollback Firebase: Usuário {} removido com sucesso.", firebaseUid);
        } catch (FirebaseAuthException deleteError) {
            logger.error("❌ FALHA NO ROLLBACK FIREBASE: Não foi possível remover o usuário {}. Erro: {}",
                    firebaseUid, deleteError.getMessage());
        }
    }

    private void rollbackLocalUser(String userId) {
        try {
            if (userRepository.existsById(userId)) {
                userRepository.deleteById(userId);
                logger.info("🔄 Rollback MySQL: Usuário {} removido com sucesso.", userId);
            }
        } catch (Exception deleteError) {
            logger.error("❌ FALHA NO ROLLBACK MYSQL: Não foi possível remover o usuário {}. Erro: {}",
                    userId, deleteError.getMessage(), deleteError);
        }
    }
}