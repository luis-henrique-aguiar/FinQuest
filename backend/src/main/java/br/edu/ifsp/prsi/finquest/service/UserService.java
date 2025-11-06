package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;
import br.edu.ifsp.prsi.finquest.model.User;

public interface UserService {

    User registerUser(RegisterUserDTO registerUserDTO);
    UserDTO findUserById(String id);
}
