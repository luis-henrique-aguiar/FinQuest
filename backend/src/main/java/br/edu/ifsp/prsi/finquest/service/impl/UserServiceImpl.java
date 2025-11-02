package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public User registerUser(RegisterUserDTO registerUserDTO) {
        log.debug("Tentando cadastrar usuário com ID: {} e email: {}",
                registerUserDTO.getId(), registerUserDTO.getEmail());

        if (userRepository.findById(registerUserDTO.getId()).isPresent()) {
            throw new BusinessException("Usuário com ID: " + registerUserDTO.getId() + " já está cadastrado.");
        }

        if (userRepository.existsByEmail(registerUserDTO.getEmail())) {
            throw new BusinessException("Email já cadastrado.");
        }

        User newUser = new User();
        newUser.setId(registerUserDTO.getId());
        newUser.setBudget(BigDecimal.ZERO);
        newUser.setAvatarUrl(null);
        newUser.setTotalFinPoints(0);
        newUser.setEmail(registerUserDTO.getEmail());
        newUser.setName(registerUserDTO.getName());

        return userRepository.save(newUser);
    }
}
