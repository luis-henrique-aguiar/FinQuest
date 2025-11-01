package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public User registerUser(RegisterUserDTO registerUserDTO) {

        if(userRepository.existsByEmail(registerUserDTO.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }

        User newUser = new User();
        newUser.setEmail(registerUserDTO.getEmail());
        newUser.setName(registerUserDTO.getName());

        return userRepository.save(newUser);
    }
}
