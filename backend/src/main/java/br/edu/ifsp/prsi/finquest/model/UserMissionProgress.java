package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "user_mission_progress")
public class UserMissionProgress {

    @EmbeddedId
    private UserMissionProgressId id;

    @Column(nullable = false)
    private int currentCount = 0;

    @Column(nullable = false, length = 20)
    private String status = "IN_PROGRESS";

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("missionId")
    @JoinColumn(name = "mission_id")
    private Mission mission;

    public UserMissionProgress() {}

    public UserMissionProgress(UserMissionProgressId id) {
        this.id = id;
        this.currentCount = 0;
        this.status = "IN_PROGRESS";
    }

    public UserMissionProgress(UserMissionProgressId id, int currentCount, String status, User user, Mission mission) {
        this.id = id;
        this.currentCount = currentCount;
        this.status = status;
        this.user = user;
        this.mission = mission;
    }

    public UserMissionProgressId getId() {
        return id;
    }

    public void setId(UserMissionProgressId id) {
        this.id = id;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Mission getMission() {
        return mission;
    }

    public void setMission(Mission mission) {
        this.mission = mission;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserMissionProgress that = (UserMissionProgress) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "UserMissionProgress{" +
                "id=" + id +
                ", currentCount=" + currentCount +
                ", status='" + status + '\'' +
                ", user=" + user +
                ", mission=" + mission +
                '}';
    }
}
