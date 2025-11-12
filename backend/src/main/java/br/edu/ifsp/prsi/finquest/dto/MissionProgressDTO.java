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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getRewardFinPoints() {
        return rewardFinPoints;
    }

    public void setRewardFinPoints(int rewardFinPoints) {
        this.rewardFinPoints = rewardFinPoints;
    }

    public MissionCategory getCategory() {
        return category;
    }

    public void setCategory(MissionCategory category) {
        this.category = category;
    }

    public int getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(int targetCount) {
        this.targetCount = targetCount;
    }

    public int getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(int currentCount) {
        this.currentCount = currentCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
