package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.SkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.entity.Skill;
import com.userskillsmanagement.usersandskillsmanagement.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    @CacheEvict(value = "skills", allEntries = true)
    public SkillDTO addNewSkill(SkillDTO skillDTO) {
        Skill skill = new Skill();
        skill.setSkillName(skillDTO.skillName());
        skill.setSkillField(skillDTO.skillField());
        Skill savedSkill = skillRepository.save(skill);
        return new SkillDTO(savedSkill.getId(), savedSkill.getSkillName(), savedSkill.getSkillField());
    }

    @Override
    @Cacheable("skills")
    public Page<SkillDTO> searchSkills(String skillName, Pageable pageable) {
        return skillRepository.findBySkillNameContainingIgnoreCase(skillName, pageable)
                .map(skill -> new SkillDTO(skill.getId(), skill.getSkillName(), skill.getSkillField()));
    }

    @Override
    @Cacheable(value = "skill", key = "#id")
    public SkillDTO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id).orElseThrow(() -> new RuntimeException("Skill not found"));
        return new SkillDTO(skill.getId(), skill.getSkillName(), skill.getSkillField());
    }
}