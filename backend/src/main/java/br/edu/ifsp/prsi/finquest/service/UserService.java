package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.UserDTO;

public interface UserService {

    UserDTO findUserById(String id);

    boolean addFinPoints(String userId, int pointsToAdd);

}
