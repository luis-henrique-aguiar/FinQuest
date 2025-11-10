package br.edu.ifsp.prsi.finquest.utils;

public enum GoalStatus {
    IN_PROGRESS("Em andamento"),
    COMPLETED("Concluída");

    private final String description;

    GoalStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
