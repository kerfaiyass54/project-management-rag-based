package com.teamsprojects.management.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record TeamUpdateRequest(
        @NotBlank String name,
        List<String> addMemberIds,
        List<String> removeMemberIds
) {}
