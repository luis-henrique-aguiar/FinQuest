package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserMissionProgressId implements Serializable {

    @Column(name = "user_id")
    private String userId;

    @Column(name = "mission_id", length = 50)
    private String missionId;

    public UserMissionProgressId() {}

    public UserMissionProgressId(String userId, String missionId) {
        this.userId = userId;
        this.missionId = missionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMissionId() {
        return missionId;
    }

    public void setMissionId(String missionId) {
        this.missionId = missionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserMissionProgressId that = (UserMissionProgressId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(missionId, that.missionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, missionId);
    }
}
