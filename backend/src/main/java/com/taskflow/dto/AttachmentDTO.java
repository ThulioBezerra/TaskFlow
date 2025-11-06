package com.taskflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDTO {
    private UUID id;
    private String fileName;
    private String fileType;
    private String url;
    private UUID taskId;
    private OffsetDateTime uploadedAt;
}
