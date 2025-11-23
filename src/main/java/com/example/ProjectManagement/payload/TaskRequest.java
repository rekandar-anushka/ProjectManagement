package com.example.ProjectManagement.payload;

import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Long assignedTo; // employee ID
    private String status;     // PENDING, ONGOING, COMPLETED
    private String dueDate;    // new field in ISO format "yyyy-MM-dd"
}
