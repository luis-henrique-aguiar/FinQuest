package br.edu.ifsp.prsi.finquest.events;

import org.springframework.context.ApplicationEvent;

public class GoalCompletedEvent extends ApplicationEvent {

    private final String userId;
    private final String goalId;

    public GoalCompletedEvent(Object source, String userId, String goalId) {
        super(source);
        this.userId = userId;
        this.goalId = goalId;
    }

    public String getUserId() {
        return userId;
    }

    public String getGoalId() {
        return goalId;
    }
}
