package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.UpdateUserEmailDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserNameDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserPasswordDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;

public interface UserService {

    UserDTO findUserById(String id);
    boolean addFinPoints(String userId, int pointsToAdd);
    UserDTO updateEmail(String userId, UpdateUserEmailDTO request);
    UserDTO updateName(String userId, UpdateUserNameDTO request);
    void updatePassword(String userId, UpdateUserPasswordDTO request);
}
