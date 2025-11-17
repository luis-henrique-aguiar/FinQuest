package br.edu.ifsp.prsi.finquest.events;

import org.springframework.context.ApplicationEvent;

public class LessonCompletedEvent extends ApplicationEvent {

    private final String userId;
    private final String lessonId;

    public LessonCompletedEvent(Object source, String userId, String lessonId) {
        super(source);
        this.userId = userId;
        this.lessonId = lessonId;
    }

    public String getUserId() {
        return userId;
    }

    public String getLessonId() {
        return lessonId;
    }
}
