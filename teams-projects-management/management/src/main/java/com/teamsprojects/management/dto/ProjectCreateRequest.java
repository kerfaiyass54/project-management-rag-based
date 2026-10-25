package com.teamsprojects.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ProjectCreateRequest(
        @NotBlank String name,
        String description,
        @Positive Integer durationDays,
        String teamId,
        String repositoryUrl
) {}
