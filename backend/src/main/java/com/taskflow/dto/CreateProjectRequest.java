package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank(message = "Project name cannot be empty")
    private String name;
    private String description;
    @NotNull(message = "Manager ID cannot be null")
    private UUID managerId; // The ID of the user creating/managing the project
    private List<UUID> memberIds; // Optional: IDs of additional members
}
