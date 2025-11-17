package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserAchievementId implements Serializable {

    @Column(name = "user_id")
    private String userId;

    @Column(name = "achievement_id")
    private Long achievementId;

    public UserAchievementId() {}

    public UserAchievementId(String userId, Long achievementId) {
        this.userId = userId;
        this.achievementId = achievementId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getAchievementId() {
        return achievementId;
    }

    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserAchievementId that = (UserAchievementId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(achievementId, that.achievementId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, achievementId);
    }

    @Override
    public String toString() {
        return "UserAchievementId{" +
                "userId='" + userId + '\'' +
                ", achievementId=" + achievementId +
                '}';
    }
}
