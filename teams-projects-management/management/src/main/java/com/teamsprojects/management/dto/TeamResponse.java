package com.teamsprojects.management.dto;

import java.time.Instant;
import java.util.List;

public record TeamResponse(
        String id,
        String name,
        List<String> memberIds,
        List<EngineerDto> members,
        Instant createdAt,
        Instant updatedAt
) {}
