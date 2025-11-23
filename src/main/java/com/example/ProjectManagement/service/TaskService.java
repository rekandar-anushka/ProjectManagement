package com.example.ProjectManagement.service;

import com.example.ProjectManagement.model.Task;
import com.example.ProjectManagement.payload.TaskRequest;
import com.example.ProjectManagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Create a new task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get tasks assigned to a specific user
    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByAssignedTo(userId);
    }

    // Get tasks for a specific employee in a specific month
    public List<Task> getTasksByUserAndMonth(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return taskRepository.findByAssignedToAndDueDateBetween(userId, start, end);
    }

    // Update task fully
    public Task updateTask(Long taskId, TaskRequest request) throws Exception {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) throw new Exception("Task not found");

        Task task = taskOpt.get();

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getAssignedTo() != null) task.setAssignedTo(request.getAssignedTo());
        if (request.getStatus() != null) {
            try {
                task.setStatus(Task.Status.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                task.setStatus(Task.Status.PENDING);
            }
        }
        if (request.getDueDate() != null && !request.getDueDate().isEmpty()) {
            try {
                task.setDueDate(LocalDate.parse(request.getDueDate()));
            } catch (Exception e) {
                task.setDueDate(null);
            }
        }

        return taskRepository.save(task);
    }

    // Delete task
    public void deleteTask(Long taskId) throws Exception {
        if (!taskRepository.existsById(taskId)) throw new Exception("Task not found");
        taskRepository.deleteById(taskId);
    }

    // Get task by ID
    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    // Employee task summary for analytics
    public Map<Long, Integer> getTaskCountPerEmployee() {
        List<Object[]> results = taskRepository.countTasksPerEmployee();
        Map<Long, Integer> summary = new HashMap<>();
        for (Object[] row : results) {
            Long userId = ((Number) row[0]).longValue();
            Integer count = ((Number) row[1]).intValue();
            summary.put(userId, count);
        }
        return summary;
    }

}
