package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.RegisterRequestDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterResponseDTO;

public interface AuthService {

    RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO);

}
