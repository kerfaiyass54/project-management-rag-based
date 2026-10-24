package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.SkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface SkillService {
    SkillDTO addNewSkill(SkillDTO skillDTO);
    Page<SkillDTO> searchSkills(String search, Pageable pageable);
    SkillDTO getSkillById(Long id);
    void deleteSkill(Long id);
    Map<String, SkillDTO> getMostAndLeastUsedSkills();
}