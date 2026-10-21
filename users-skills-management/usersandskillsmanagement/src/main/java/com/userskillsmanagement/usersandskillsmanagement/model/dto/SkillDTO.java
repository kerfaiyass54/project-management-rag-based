package com.userskillsmanagement.usersandskillsmanagement.model.dto;

import com.userskillsmanagement.usersandskillsmanagement.model.enums.SkillField;

public record SkillDTO(Long id, String skillName, SkillField skillField) {
}