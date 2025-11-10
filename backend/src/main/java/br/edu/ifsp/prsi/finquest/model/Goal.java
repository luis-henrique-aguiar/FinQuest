package br.edu.ifsp.prsi.finquest.model;

import br.edu.ifsp.prsi.finquest.utils.GoalStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "target_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal targetAmount;

    @Column(name = "current_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GoalStatus status = GoalStatus.IN_PROGRESS;

    @Column(name = "xp_generated", nullable = false)
    private Boolean xpGenerated = false;

    public Goal() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public BigDecimal getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }

    public Boolean isXpGenerated() { return xpGenerated; }
    public void setXpGenerated(Boolean xpGenerated) { this.xpGenerated = xpGenerated; }
}
