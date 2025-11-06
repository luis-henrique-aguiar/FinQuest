package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.RegisterUserDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Void> registerUser(
            @RequestBody @Valid RegisterUserDTO registerUserDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String authenticatedUid = userDetails.getUsername();

        if (!registerUserDTO.id().equals(authenticatedUid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        userService.registerUser(registerUserDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        UserDTO userDTO = userService.findUserById(id);
        return ResponseEntity.ok(userDTO);
    }
}
