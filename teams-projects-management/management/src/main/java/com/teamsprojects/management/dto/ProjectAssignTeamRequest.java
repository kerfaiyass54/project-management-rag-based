package com.teamsprojects.management.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectAssignTeamRequest(@NotBlank String teamId) {}
