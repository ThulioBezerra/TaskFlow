package com.taskflow.dto;

import com.taskflow.model.UserRole;
import lombok.Data;

import java.util.UUID;

@Data
public class AddProjectMemberRequestDto {
    private UUID userId;
    private UserRole role;
}
