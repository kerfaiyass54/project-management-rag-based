package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.SkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SkillService {
    SkillDTO addNewSkill(SkillDTO skillDTO);
    Page<SkillDTO> searchSkills(String skillName, Pageable pageable);
}