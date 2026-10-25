package com.teamsprojects.management.dto;

import java.time.Instant;

public record ProjectResponse(
        String id,
        String name,
        String description,
        Integer durationDays,
        String teamId,
        String repositoryUrl,
        Instant createdAt,
        Instant updatedAt
) {}
