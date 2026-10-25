package com.teamsprojects.management.dto;

import java.util.List;

public record EngineerDto(
        String id,
        String firstName,
        String lastName,
        String email,
        List<String> skills,
        String role
) {}
