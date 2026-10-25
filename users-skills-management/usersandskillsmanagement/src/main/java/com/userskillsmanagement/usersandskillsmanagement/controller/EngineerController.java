package com.userskillsmanagement.usersandskillsmanagement.controller;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDetailsDTO;
import com.userskillsmanagement.usersandskillsmanagement.service.EngineerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/engineers")
@RequiredArgsConstructor
public class EngineerController {

    private final EngineerService engineerService;

    @PostMapping
    public ResponseEntity<EngineerDTO> addNewEngineer(@RequestBody EngineerDTO engineerDTO) {
        return ResponseEntity.ok(engineerService.addNewEngineer(engineerDTO));
    }

    @GetMapping
    public ResponseEntity<Page<EngineerDTO>> getAllEngineers(
            @RequestParam(defaultValue = "") String search,
            Pageable pageable) {
        return ResponseEntity.ok(engineerService.getAllEngineers(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EngineerDTO> getEngineerById(@PathVariable Long id) {
        return ResponseEntity.ok(engineerService.getEngineerById(id));
    }

    @GetMapping("/{id}/skills")
    public ResponseEntity<List<EngineerSkillDetailsDTO>> getEngineerSkills(@PathVariable Long id) {
        return ResponseEntity.ok(engineerService.getEngineerSkills(id));
    }

    @PostMapping("/skills")
    public ResponseEntity<EngineerSkillDTO> assignSkillToEngineer(@RequestBody EngineerSkillDTO engineerSkillDTO) {
        return ResponseEntity.ok(engineerService.assignSkillToEngineer(engineerSkillDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EngineerDTO> updateEngineer(@PathVariable Long id, @RequestBody EngineerDTO engineerDTO) {
        return ResponseEntity.ok(engineerService.updateEngineer(id, engineerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEngineer(@PathVariable Long id) {
        engineerService.deleteEngineer(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<EngineerSkillDTO> updateEngineerSkill(@PathVariable Long id, @RequestBody EngineerSkillDTO engineerSkillDTO) {
        return ResponseEntity.ok(engineerService.updateEngineerSkill(id, engineerSkillDTO));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(engineerService.getTotalUsers());
    }

    @GetMapping("/count-by-type")
    public ResponseEntity<Map<String, Long>> countUsersByType() {
        return ResponseEntity.ok(engineerService.countUsersByType());
    }
}