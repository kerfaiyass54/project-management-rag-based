package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.entity.Engineer;
import com.userskillsmanagement.usersandskillsmanagement.model.entity.EngineerSkill;
import com.userskillsmanagement.usersandskillsmanagement.model.entity.Skill;
import com.userskillsmanagement.usersandskillsmanagement.repository.EngineerRepository;
import com.userskillsmanagement.usersandskillsmanagement.repository.EngineerSkillRepository;
import com.userskillsmanagement.usersandskillsmanagement.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EngineerServiceImpl implements EngineerService {

    private final EngineerRepository engineerRepository;
    private final SkillRepository skillRepository;
    private final EngineerSkillRepository engineerSkillRepository;

    @Override
    @CacheEvict(value = "engineers", allEntries = true)
    public EngineerDTO addNewEngineer(EngineerDTO engineerDTO) {
        Engineer engineer = new Engineer();
        engineer.setEngineerName(engineerDTO.engineerName());
        engineer.setEngineerSpeciality(engineerDTO.engineerSpeciality());
        engineer.setEngineerExperience(engineerDTO.engineerExperience());
        engineer.setEngineerPosition(engineerDTO.engineerPosition());
        engineer.setTeamId(engineerDTO.teamId());
        Engineer savedEngineer = engineerRepository.save(engineer);
        return new EngineerDTO(savedEngineer.getId(), savedEngineer.getEngineerName(), savedEngineer.getEngineerSpeciality(), savedEngineer.getEngineerExperience(), savedEngineer.getEngineerPosition(), savedEngineer.getTeamId());
    }

    @Override
    public Page<EngineerDTO> getAllEngineers(String search, Pageable pageable) {
        return engineerRepository.findByEngineerNameContainingIgnoreCase(search == null ? "" : search, pageable)
                .map(engineer -> new EngineerDTO(engineer.getId(), engineer.getEngineerName(), engineer.getEngineerSpeciality(), engineer.getEngineerExperience(), engineer.getEngineerPosition(), engineer.getTeamId()));
    }

    @Override
    @Cacheable(value = "engineer", key = "#id")
    public EngineerDTO getEngineerById(Long id) {
        Engineer engineer = engineerRepository.findById(id).orElseThrow(() -> new RuntimeException("Engineer not found"));
        return new EngineerDTO(engineer.getId(), engineer.getEngineerName(), engineer.getEngineerSpeciality(), engineer.getEngineerExperience(), engineer.getEngineerPosition(), engineer.getTeamId());
    }

    @Override
    public EngineerSkillDTO assignSkillToEngineer(EngineerSkillDTO engineerSkillDTO) {
        Engineer engineer = engineerRepository.findById(engineerSkillDTO.engineerId()).orElseThrow(() -> new RuntimeException("Engineer not found"));
        Skill skill = skillRepository.findById(engineerSkillDTO.skillId()).orElseThrow(() -> new RuntimeException("Skill not found"));

        EngineerSkill engineerSkill = new EngineerSkill();
        engineerSkill.setEngineer(engineer);
        engineerSkill.setSkill(skill);
        engineerSkill.setProficiencyLevel(engineerSkillDTO.proficiencyLevel());
        EngineerSkill savedEngineerSkill = engineerSkillRepository.save(engineerSkill);
        return new EngineerSkillDTO(savedEngineerSkill.getId(), savedEngineerSkill.getEngineer().getId(), savedEngineerSkill.getSkill().getId(), savedEngineerSkill.getProficiencyLevel());
    }

    @Override
    @CacheEvict(value = {"engineers", "engineer"}, allEntries = true)
    public EngineerDTO updateEngineer(Long id, EngineerDTO engineerDTO) {
        Engineer engineer = engineerRepository.findById(id).orElseThrow(() -> new RuntimeException("Engineer not found"));
        engineer.setEngineerSpeciality(engineerDTO.engineerSpeciality());
        engineer.setEngineerExperience(engineerDTO.engineerExperience());
        engineer.setEngineerPosition(engineerDTO.engineerPosition());
        Engineer updatedEngineer = engineerRepository.save(engineer);
        return new EngineerDTO(updatedEngineer.getId(), updatedEngineer.getEngineerName(), updatedEngineer.getEngineerSpeciality(), updatedEngineer.getEngineerExperience(), updatedEngineer.getEngineerPosition(), updatedEngineer.getTeamId());
    }

    @Override
    @CacheEvict(value = {"engineers", "engineer"}, allEntries = true)
    public void deleteEngineer(Long id) {
        if (!engineerRepository.existsById(id)) {
            throw new RuntimeException("Engineer not found");
        }
        engineerRepository.deleteById(id);
    }

    @Override
    public EngineerSkillDTO updateEngineerSkill(Long id, EngineerSkillDTO engineerSkillDTO) {
        EngineerSkill engineerSkill = engineerSkillRepository.findById(id).orElseThrow(() -> new RuntimeException("EngineerSkill not found"));
        engineerSkill.setProficiencyLevel(engineerSkillDTO.proficiencyLevel());
        EngineerSkill updatedEngineerSkill = engineerSkillRepository.save(engineerSkill);
        return new EngineerSkillDTO(updatedEngineerSkill.getId(), updatedEngineerSkill.getEngineer().getId(), updatedEngineerSkill.getSkill().getId(), updatedEngineerSkill.getProficiencyLevel());
    }

    @Override
    public long getTotalUsers() {
        return engineerRepository.count();
    }

    @Override
    public Map<String, Long> countUsersByType() {
        return engineerRepository.findAll().stream()
                .collect(Collectors.groupingBy(Engineer::getEngineerPosition, Collectors.counting()));
    }
}