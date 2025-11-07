package com.taskflow.dto;

import lombok.Data;

@Data
public class ProjectRequestDto {
    private String name;
    private String description;
    private String webhookUrl;
    private java.util.List<String> notificationEvents;
}
