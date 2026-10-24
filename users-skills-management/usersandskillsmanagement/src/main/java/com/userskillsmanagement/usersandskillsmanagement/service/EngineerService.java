package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface EngineerService {
    EngineerDTO addNewEngineer(EngineerDTO engineerDTO);
    Page<EngineerDTO> getAllEngineers(String search, Pageable pageable);
    EngineerDTO getEngineerById(Long id);
    EngineerSkillDTO assignSkillToEngineer(EngineerSkillDTO engineerSkillDTO);
    EngineerDTO updateEngineer(Long id, EngineerDTO engineerDTO);
    void deleteEngineer(Long id);
    EngineerSkillDTO updateEngineerSkill(Long id, EngineerSkillDTO engineerSkillDTO);
    long getTotalUsers();
    Map<String, Long> countUsersByType();
}