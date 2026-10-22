package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;

import java.util.List;

public interface EngineerService {
    EngineerDTO addNewEngineer(EngineerDTO engineerDTO);

    List<EngineerDTO> getAllEngineers();

    EngineerDTO getEngineerById(Long id);

    EngineerSkillDTO assignSkillToEngineer(EngineerSkillDTO engineerSkillDTO);

    EngineerDTO updateEngineer(Long id, EngineerDTO engineerDTO);

    EngineerSkillDTO updateEngineerSkill(Long id, EngineerSkillDTO engineerSkillDTO);
}