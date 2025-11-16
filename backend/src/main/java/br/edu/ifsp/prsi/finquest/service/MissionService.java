package br.edu.ifsp.prsi.finquest.service;

import br.edu.ifsp.prsi.finquest.dto.MissionProgressDTO;

import java.util.List;

public interface MissionService {

    List<MissionProgressDTO> getMissionsForUser(String userId);

}
