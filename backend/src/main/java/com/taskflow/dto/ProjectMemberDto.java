package com.taskflow.dto;

import com.taskflow.model.UserRole;
import lombok.Data;

import java.util.UUID;

@Data
public class ProjectMemberDto {
    private UUID userId;
    private String email;
    private UserRole role;
}
