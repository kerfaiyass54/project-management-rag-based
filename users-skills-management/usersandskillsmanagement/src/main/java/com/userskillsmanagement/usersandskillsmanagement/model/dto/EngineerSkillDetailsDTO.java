package com.userskillsmanagement.usersandskillsmanagement.model.dto;

public record EngineerSkillDetailsDTO(
        Long id,
        Long engineerId,
        Long skillId,
        String skillName,
        String skillField,
        String proficiencyLevel
) {
}
