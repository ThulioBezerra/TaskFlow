package com.taskflow.dto;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
public class ProjectResponseDto {
    private UUID id;
    private String name;
    private String description;
    private OffsetDateTime createdAt;
    private Set<ProjectMemberDto> members;
}
