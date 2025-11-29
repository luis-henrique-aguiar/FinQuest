package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.RegisterRequestDTO;
import br.edu.ifsp.prsi.finquest.dto.RegisterResponseDTO;
import br.edu.ifsp.prsi.finquest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO registerRequestDTO) throws Exception {
        RegisterResponseDTO response = authService.register(registerRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
