package com.teamsprojects.management.dto;

import jakarta.validation.constraints.Positive;

public record ProjectUpdateRequest(
        String description,
        @Positive Integer durationDays,
        String repositoryUrl
) {}
