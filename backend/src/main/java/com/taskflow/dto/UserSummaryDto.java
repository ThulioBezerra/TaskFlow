package com.taskflow.dto;

import java.util.UUID;

public record UserSummaryDto(
    UUID id,
    String email
) {}
