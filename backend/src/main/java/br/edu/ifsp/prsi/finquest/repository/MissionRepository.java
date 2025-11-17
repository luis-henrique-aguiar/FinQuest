package br.edu.ifsp.prsi.finquest.repository;

import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, String> {

    List<Mission> findByTriggerEventType(MissionTriggerType triggerEventType);

}
