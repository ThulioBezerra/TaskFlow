package com.taskflow.dto;

import java.util.UUID;

public record ProjectSummaryDto(
    UUID id,
    String name
) {}
