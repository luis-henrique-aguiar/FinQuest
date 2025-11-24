package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.UpdateUserEmailDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserNameDTO;
import br.edu.ifsp.prsi.finquest.dto.UpdateUserPasswordDTO;
import br.edu.ifsp.prsi.finquest.dto.UserDTO;
import br.edu.ifsp.prsi.finquest.service.UserService;
import jakarta.validation.Valid;
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

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        UserDTO userDTO = userService.findUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/name")
    public ResponseEntity<UserDTO> updateName(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserNameDTO request
    ) {
        String userId = userDetails.getUsername();
        UserDTO updatedUser = userService.updateName(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/email")
    public ResponseEntity<UserDTO> updateEmail(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserEmailDTO request
    ) {
        String userId = userDetails.getUsername();
        UserDTO updatedUser = userService.updateEmail(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserPasswordDTO request
    ) {
        String userId = userDetails.getUsername();
        userService.updatePassword(userId, request);
        return ResponseEntity.noContent().build();
    }
}
