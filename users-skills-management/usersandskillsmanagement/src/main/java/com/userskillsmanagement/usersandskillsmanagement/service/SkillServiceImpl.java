package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.SkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.entity.Skill;
import com.userskillsmanagement.usersandskillsmanagement.repository.EngineerSkillRepository;
import com.userskillsmanagement.usersandskillsmanagement.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final EngineerSkillRepository engineerSkillRepository;

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

    @Override
    @CacheEvict(value = {"skills", "skill"}, allEntries = true)
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new RuntimeException("Skill not found");
        }
        skillRepository.deleteById(id);
    }

    @Override
    public Map<String, SkillDTO> getMostAndLeastUsedSkills() {
        Map<Long, Long> skillUsage = engineerSkillRepository.findAll().stream()
                .collect(Collectors.groupingBy(es -> es.getSkill().getId(), Collectors.counting()));

        if (skillUsage.isEmpty()) {
            return Map.of();
        }

        Skill mostUsedSkill = skillRepository.findById(skillUsage.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey()).orElse(null);
        Skill leastUsedSkill = skillRepository.findById(skillUsage.entrySet().stream().min(Map.Entry.comparingByValue()).get().getKey()).orElse(null);

        return Map.of(
                "mostUsed", new SkillDTO(mostUsedSkill.getId(), mostUsedSkill.getSkillName(), mostUsedSkill.getSkillField()),
                "leastUsed", new SkillDTO(leastUsedSkill.getId(), leastUsedSkill.getSkillName(), leastUsedSkill.getSkillField())
        );
    }
}