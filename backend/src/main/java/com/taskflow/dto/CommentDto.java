package com.taskflow.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CommentDto(
    UUID id,
    String content,
    UserSummaryDto author,
    OffsetDateTime createdAt,
    UUID taskId
) {}
