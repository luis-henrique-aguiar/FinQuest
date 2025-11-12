package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgress;
import br.edu.ifsp.prsi.finquest.model.enums.MissionCategory;

public class MissionProgressDTO {

    private String id;
    private String title;
    private String description;
    private int rewardFinPoints;
    private MissionCategory category;
    private int targetCount;
    private int currentCount;
    private String status;

    public MissionProgressDTO(Mission mission, UserMissionProgress progress) {
        this.id = mission.getId();
        this.title = mission.getTitle();
        this.description = mission.getDescription();
        this.rewardFinPoints = mission.getRewardFinPoints();
        this.category = mission.getCategory();
        this.targetCount = mission.getTargetCount();

        if (progress != null) {
            this.currentCount = progress.getCurrentCount();
            this.status = progress.getStatus();
        } else {
            this.currentCount = 0;
            this.status = "NOT_STARTED";
        }
    }
}
