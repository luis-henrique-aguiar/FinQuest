package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class UserEnrollmentId implements Serializable {
    private String userId;
    private UUID courseId;

    public UserEnrollmentId() {}

    public UserEnrollmentId(String userId, UUID courseId) {
        this.userId = userId;
        this.courseId = courseId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserEnrollmentId that = (UserEnrollmentId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(courseId, that.courseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, courseId);
    }
}
