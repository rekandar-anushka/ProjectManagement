package com.example.ProjectManagement.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, length = 100) // ensure bcrypt hash fits
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        EMPLOYEE,
        MANAGER
    }
}
