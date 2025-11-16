package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Mission;
import br.edu.ifsp.prsi.finquest.model.UserMissionProgress;
import br.edu.ifsp.prsi.finquest.model.enums.MissionCategory;
import br.edu.ifsp.prsi.finquest.model.enums.MissionStatus;

public class MissionProgressDTO {

    private String id;
    private String title;
    private String description;
    private int rewardFinPoints;
    private MissionCategory category;
    private int targetCount;
    private int currentCount;
    private MissionStatus status;
    private int progressPercentage;

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
            this.status = MissionStatus.NOT_STARTED;
        }

        this.progressPercentage = calculateProgressPercentage();
    }

    private int calculateProgressPercentage() {
        if (targetCount <= 0) {
            return 0;
        }
        int percentage = (int) (((double) currentCount / targetCount) * 100);
        return Math.min(percentage, 100);
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getRewardFinPoints() {
        return rewardFinPoints;
    }

    public MissionCategory getCategory() {
        return category;
    }

    public int getTargetCount() {
        return targetCount;
    }

    public int getCurrentCount() {
        return currentCount;
    }

    public MissionStatus getStatus() {
        return status;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRewardFinPoints(int rewardFinPoints) {
        this.rewardFinPoints = rewardFinPoints;
    }

    public void setCategory(MissionCategory category) {
        this.category = category;
    }

    public void setTargetCount(int targetCount) {
        this.targetCount = targetCount;
    }

    public void setCurrentCount(int currentCount) {
        this.currentCount = currentCount;
    }

    public void setStatus(MissionStatus status) {
        this.status = status;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    @Override
    public String toString() {
        return "MissionProgressDTO{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", currentCount=" + currentCount +
                ", targetCount=" + targetCount +
                ", status=" + status +
                ", progressPercentage=" + progressPercentage +
                '}';
    }
}
