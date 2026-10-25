package com.teamsprojects.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record TeamCreateRequest(
        @NotBlank String name,
        @NotEmpty List<String> memberIds
) {}
