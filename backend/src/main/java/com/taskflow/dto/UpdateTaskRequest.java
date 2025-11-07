package com.taskflow.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDate dueDate;
    private String assigneeEmail;
    private TaskStatus status;
    private java.util.Optional<java.util.UUID> projectId;
}
