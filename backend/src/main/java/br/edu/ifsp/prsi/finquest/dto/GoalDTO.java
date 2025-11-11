package br.edu.ifsp.prsi.finquest.dto;

import br.edu.ifsp.prsi.finquest.model.Goal;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class GoalDTO {
    private String id;
    private String name;
    private String statusLabel;
    private BigDecimal currentAmount;
    private BigDecimal targetAmount;
    private String completionPercentage;
    private BigDecimal remainingAmount;
    private boolean deletable;

    public GoalDTO(){}

    public static GoalDTO fromEntity(Goal goal) {
        GoalDTO response = new GoalDTO();

        response.id = goal.getId();
        response.name = goal.getName();
        response.statusLabel = goal.getStatus().getDescription();
        response.currentAmount = goal.getCurrentAmount();
        response.targetAmount = goal.getTargetAmount();
        response.deletable = !goal.isXpGenerated();

        response.remainingAmount = goal.getTargetAmount().subtract(goal.getCurrentAmount());

        if (response.remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            response.remainingAmount = BigDecimal.ZERO;
        }

        if (goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentage = goal.getCurrentAmount()
                    .multiply(new BigDecimal(100))
                    .divide(goal.getTargetAmount(), 0, RoundingMode.DOWN);
            response.completionPercentage = percentage.intValue() + "%";
        } else {
            response.completionPercentage = "0%";
        }

        return response;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public BigDecimal getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public String getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(String completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public boolean isDeletable() {
        return deletable;
    }

    public void setDeletable(boolean deletable) {
        this.deletable = deletable;
    }
}
