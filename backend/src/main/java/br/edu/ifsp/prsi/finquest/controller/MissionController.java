package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.MissionProgressDTO;
import br.edu.ifsp.prsi.finquest.service.MissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/missions")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @GetMapping
    public ResponseEntity<List<MissionProgressDTO>> getMissions(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<MissionProgressDTO> missions = missionService.getMissionsForUser(userId);
        return ResponseEntity.ok(missions);
    }
}
