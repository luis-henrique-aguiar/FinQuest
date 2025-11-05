package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserLessonCompletionId implements Serializable {

    @Column(name = "user_id")
    private String userId;

    @Column(name = "lesson_id")
    private String lessonId;

    public UserLessonCompletionId() {}

    public UserLessonCompletionId(String userId, String lessonId) {
        this.userId = userId;
        this.lessonId = lessonId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserLessonCompletionId that = (UserLessonCompletionId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(lessonId, that.lessonId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, lessonId);
    }

    @Override
    public String toString() {
        return "UserLessonCompletionId{" +
                "userId='" + userId + '\'' +
                ", lessonId='" + lessonId + '\'' +
                '}';
    }
}
