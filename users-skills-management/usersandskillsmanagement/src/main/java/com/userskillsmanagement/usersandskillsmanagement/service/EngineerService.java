package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;

import java.util.List;

public interface EngineerService {
    EngineerDTO addNewEngineer(EngineerDTO engineerDTO);
    List<EngineerDTO> getAllEngineers();
    EngineerSkillDTO assignSkillToEngineer(EngineerSkillDTO engineerSkillDTO);
}