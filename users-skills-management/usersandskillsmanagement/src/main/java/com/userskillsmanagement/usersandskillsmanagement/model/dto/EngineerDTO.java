package com.userskillsmanagement.usersandskillsmanagement.model.dto;

import com.userskillsmanagement.usersandskillsmanagement.model.enums.EngineerExperience;

public record EngineerDTO(Long id, String engineerName, String engineerSpeciality, EngineerExperience engineerExperience, String engineerPosition, Long teamId) {
}