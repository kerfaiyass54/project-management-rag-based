package com.userskillsmanagement.usersandskillsmanagement.model.dto;

public record ManagerDTO(
        Long id,
        String managerName,
        int managerExperience,
        String managementArea
) { }