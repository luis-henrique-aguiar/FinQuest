package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "user_enrollment")
public class UserEnrollment {

    @EmbeddedId
    private UserEnrollmentId id;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "progress", nullable = false)
    private Integer progress;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    public UserEnrollment() {}

    public UserEnrollment(UserEnrollmentId id, LocalDate startDate, LocalDate completionDate, int progress, User user, Course course) {
        this.id = id;
        this.startDate = startDate;
        this.completionDate = completionDate;
        this.progress = progress;
        this.user = user;
        this.course = course;
    }

    public UserEnrollmentId getId() {
        return id;
    }

    public void setId(UserEnrollmentId id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserEnrollment that = (UserEnrollment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "UserEnrollment{" +
                "id=" + id +
                ", startDate=" + startDate +
                ", completionDate=" + completionDate +
                ", progress=" + progress +
                ", user=" + user +
                ", course=" + course +
                '}';
    }
}
