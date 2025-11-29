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
    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) throws Exception {
        logger.info("Iniciando registro de usuário: {}", registerRequestDTO.email());

        if (userRepository.existsByEmail(registerRequestDTO.email())) {
            throw new BusinessException("Email já cadastrado.");
        }

        UserRecord firebaseUser = null;

        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(registerRequestDTO.email())
                    .setPassword(registerRequestDTO.password())
                    .setDisplayName(registerRequestDTO.name())
                    .setEmailVerified(false);

            firebaseUser = firebaseAuth.createUser(request);
            logger.info("Usuário criado no Firebase: {}", firebaseUser.getUid());

            User newUser = new User();
            newUser.setId(firebaseUser.getUid());
            newUser.setEmail(registerRequestDTO.email());
            newUser.setName(registerRequestDTO.name());
            newUser.setAvatarUrl(null);
            newUser.setTotalFinPoints(0);
            newUser.setLevel(1);
            newUser.setRole(UserRole.USER);

            userRepository.save(newUser);
            logger.info("Usuário salvo no banco de dados: {}", newUser.getId());

            return new RegisterResponseDTO(
                    firebaseUser.getUid(),
                    registerRequestDTO.name(),
                    registerRequestDTO.email()
            );

        } catch (FirebaseAuthException e) {
            logger.error("Erro ao criar usuário no Firebase: {}", e.getMessage());

            if (firebaseUser != null) {
                try {
                    firebaseAuth.deleteUser(firebaseUser.getUid());
                    logger.info("Rollback: Usuário deletado do Firebase");
                } catch (FirebaseAuthException deleteError) {
                    logger.error("Erro no rollback do Firebase: {}", deleteError.getMessage());
                }
            }

            throw new BusinessException("Erro ao criar usuário: " + e.getMessage());

        } catch (Exception e) {
            logger.error("Erro inesperado no registro: {}", e.getMessage());
            if (firebaseUser != null) {
                try {
                    firebaseAuth.deleteUser(firebaseUser.getUid());
                    userRepository.deleteById(firebaseUser.getUid());
                    logger.info("Rollback completo: Usuário deletado do Firebase e do banco");
                } catch (Exception rollbackError) {
                    logger.error("Erro no rollback: {}", rollbackError.getMessage());
                }
            }

            throw new BusinessException("Erro ao registrar usuário.");
        }
    }
}
