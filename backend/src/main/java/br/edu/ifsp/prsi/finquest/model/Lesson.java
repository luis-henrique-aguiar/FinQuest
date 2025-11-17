package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer recFinPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "lesson_order", nullable = false)
    private Integer lessonOrder;

    public Lesson() {}

    public Lesson(String id, String title, Integer recFinPoints, Course course) {
        this.id = id;
        this.title = title;
        this.recFinPoints = recFinPoints;
        this.course = course;
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

    public Integer getRecFinPoints() {
        return recFinPoints;
    }

    public void setRecFinPoints(Integer recFinPoints) {
        this.recFinPoints = recFinPoints;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Lesson lesson = (Lesson) o;
        return Objects.equals(id, lesson.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Lesson{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", recFinPoints=" + recFinPoints +
                ", course=" + course +
                ", lessonOrder=" + lessonOrder +
                '}';
    }
}
