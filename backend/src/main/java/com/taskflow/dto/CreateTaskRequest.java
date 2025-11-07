package com.taskflow.dto;

import java.util.UUID;

import com.taskflow.model.TaskPriority;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    @NotBlank
    private String title;
    private String description;
    private UUID projectId;
    private TaskPriority priority; // opcional ou @NotNull se quiser obrigar
}