package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.AdminStatsDTO;
import br.edu.ifsp.prsi.finquest.dto.UserSummaryDTO;
import br.edu.ifsp.prsi.finquest.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getSystemStats() {
        AdminStatsDTO stats = adminService.getSystemStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserSummaryDTO>> getAllUsers(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<UserSummaryDTO> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{userId}/promote")
    public ResponseEntity<Void> promoteUserToAdmin(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable String userId
    ) {
        String adminId = userDetails.getUsername();
        adminService.promoteUserToAdmin(userId, adminId);
        return ResponseEntity.ok().build();
    }
}
