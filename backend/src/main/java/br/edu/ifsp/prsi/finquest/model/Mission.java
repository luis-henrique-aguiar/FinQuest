package br.edu.ifsp.prsi.finquest.model;

import br.edu.ifsp.prsi.finquest.model.enums.MissionCategory;
import br.edu.ifsp.prsi.finquest.model.enums.MissionTriggerType;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "missions")
public class Mission {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private int rewardFinPoints;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MissionCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MissionTriggerType triggerEventType;

    @Column(nullable = false)
    private int targetCount;

    public Mission() {}

    public Mission(String id, String title, String description, int rewardFinPoints, MissionCategory category,
                   MissionTriggerType triggerEventType, int targetCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rewardFinPoints = rewardFinPoints;
        this.category = category;
        this.triggerEventType = triggerEventType;
        this.targetCount = targetCount;
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

    public MissionTriggerType getTriggerEventType() {
        return triggerEventType;
    }

    public void setTriggerEventType(MissionTriggerType triggerEventType) {
        this.triggerEventType = triggerEventType;
    }

    public int getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(int targetCount) {
        this.targetCount = targetCount;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Mission mission = (Mission) o;
        return Objects.equals(id, mission.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Mission{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", rewardFinPoints=" + rewardFinPoints +
                ", category=" + category +
                ", triggerEventType=" + triggerEventType +
                ", targetCount=" + targetCount +
                '}';
    }
}
