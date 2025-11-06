package com.taskflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private UserDto manager;
    private List<UserDto> members;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String email;
    }
}
