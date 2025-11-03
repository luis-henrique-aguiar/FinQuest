package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public User registerUser(RegisterUserDTO registerUserDTO) {
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

        return userRepository.save(newUser);
    }
}
