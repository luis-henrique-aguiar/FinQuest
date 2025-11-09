package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "total_fin_points")
    private Integer totalFinPoints;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "level", nullable = false)
    private Integer level;

    public User() {}

    public User(String id, String name, String email, Integer totalFinPoints,
                BigDecimal budget, String avatarUrl, Integer level) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.totalFinPoints = totalFinPoints;
        this.budget = budget;
        this.avatarUrl = avatarUrl;
        this.level = level;
    }

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public int getTotalFinPoints() { return totalFinPoints; }

    public void setTotalFinPoints(int totalFinPoints) {
        this.totalFinPoints = totalFinPoints;
    }

    public BigDecimal getBudget() { return budget; }

    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public String getAvatarUrl() { return avatarUrl; }

    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public void setTotalFinPoints(Integer totalFinPoints) {
        this.totalFinPoints = totalFinPoints;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", totalFinPoints=" + totalFinPoints +
                ", budget=" + budget +
                ", avatarUrl='" + avatarUrl + '\'' +
                ", level=" + level +
                '}';
    }
}
