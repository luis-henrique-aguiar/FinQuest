package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;

public interface UserService {

    UserDTO registerUser(RegisterUserDTO registerUserDTO);

    UserDTO findUserById(String id);

}
