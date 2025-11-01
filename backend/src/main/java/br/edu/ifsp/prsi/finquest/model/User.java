package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "total_fin_points")
    private int totalFinPoints;

    @Column(name = "budget", precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(name = "avatar_url")
    private String avatarUrl;
}
