package com.example.ProjectManagement.repository;

import com.example.ProjectManagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Get tasks assigned to a user
    List<Task> findByAssignedTo(Long userId);

    // Get tasks assigned to a user within a date range
    List<Task> findByAssignedToAndDueDateBetween(Long userId, LocalDate start, LocalDate end);

    // Count tasks per employee for analytics
    @Query("SELECT t.assignedTo, COUNT(t) FROM Task t GROUP BY t.assignedTo")
    List<Object[]> countTasksPerEmployee();
}
