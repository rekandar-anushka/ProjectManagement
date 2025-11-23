package com.example.ProjectManagement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Long assignedTo; // store username or userId

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING; // default to PENDING

    private LocalDate dueDate; // <-- new field for monthly goals

    public enum Status {
        PENDING,
        ONGOING,
        COMPLETED
    }
}
