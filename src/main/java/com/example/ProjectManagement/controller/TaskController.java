package com.example.ProjectManagement.controller;

import com.example.ProjectManagement.model.Task;
import com.example.ProjectManagement.model.User;
import com.example.ProjectManagement.payload.TaskRequest;
import com.example.ProjectManagement.service.TaskService;
import com.example.ProjectManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    // Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // Get tasks by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    // Create new task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().isEmpty())
                return ResponseEntity.badRequest().body("Title is required");

            if (request.getAssignedTo() == null)
                return ResponseEntity.badRequest().body("AssignedTo (employee ID) is required");

            Optional<User> assignedUserOpt = userService.findById(request.getAssignedTo());
            if (assignedUserOpt.isEmpty())
                return ResponseEntity.badRequest().body("Assigned employee not found");

            Task task = new Task();
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setAssignedTo(request.getAssignedTo());

            if (request.getStatus() != null) {
                try {
                    task.setStatus(Task.Status.valueOf(request.getStatus().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    task.setStatus(Task.Status.PENDING);
                }
            } else {
                task.setStatus(Task.Status.PENDING);
            }

            if (request.getDueDate() != null && !request.getDueDate().isEmpty()) {
                try {
                    task.setDueDate(LocalDate.parse(request.getDueDate()));
                } catch (Exception e) {
                    task.setDueDate(null);
                }
            }

            return ResponseEntity.ok(taskService.createTask(task));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create task: " + e.getMessage());
        }
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        try {
            return ResponseEntity.ok(taskService.updateTask(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update task: " + e.getMessage());
        }
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok("Task deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete task: " + e.getMessage());
        }
    }

    // Employee summary
    @GetMapping("/employee-summary")
    public ResponseEntity<?> getEmployeeSummary() {
        Map<Long, Integer> summary = taskService.getTaskCountPerEmployee();
        Map<String, Integer> result = new HashMap<>();

        // ✅ Safe conversion
        for (Map.Entry<Long, Integer> entry : summary.entrySet()) {
            Long userId = entry.getKey();
            Integer count = entry.getValue();
            userService.findById(userId).ifPresent(u -> result.put(u.getUsername(), count));
        }

        return ResponseEntity.ok(result);
    }
}
