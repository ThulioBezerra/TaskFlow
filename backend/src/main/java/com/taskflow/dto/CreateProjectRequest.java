package com.taskflow.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank(message = "Project name cannot be empty")
    private String name;
    private String description;
    private List<String> memberEmails; // Optional: IDs of additional members
}
