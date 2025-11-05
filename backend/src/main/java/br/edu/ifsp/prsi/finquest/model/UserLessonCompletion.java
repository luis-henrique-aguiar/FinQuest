package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "user_lesson_completion")
public class UserLessonCompletion {

    @EmbeddedId
    private UserLessonCompletionId id;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("lessonId")
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    public UserLessonCompletion() {}

    public UserLessonCompletion(UserLessonCompletionId id, LocalDateTime completedAt, User user, Lesson lesson) {
        this.id = id;
        this.completedAt = completedAt;
        this.user = user;
        this.lesson = lesson;
    }

    public UserLessonCompletionId getId() {
        return id;
    }

    public void setId(UserLessonCompletionId id) {
        this.id = id;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserLessonCompletion that = (UserLessonCompletion) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "UserLessonCompletion{" +
                "id=" + id +
                ", completedAt=" + completedAt +
                ", user=" + user +
                ", lesson=" + lesson +
                '}';
    }
}
