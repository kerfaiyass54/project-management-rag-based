package com.userskillsmanagement.usersandskillsmanagement.controller;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.service.EngineerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<EngineerDTO>> getAllEngineers() {
        return ResponseEntity.ok(engineerService.getAllEngineers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EngineerDTO> getEngineerById(@PathVariable Long id) {
        return ResponseEntity.ok(engineerService.getEngineerById(id));
    }

    @PostMapping("/skills")
    public ResponseEntity<EngineerSkillDTO> assignSkillToEngineer(@RequestBody EngineerSkillDTO engineerSkillDTO) {
        return ResponseEntity.ok(engineerService.assignSkillToEngineer(engineerSkillDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EngineerDTO> updateEngineer(@PathVariable Long id, @RequestBody EngineerDTO engineerDTO) {
        return ResponseEntity.ok(engineerService.updateEngineer(id, engineerDTO));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<EngineerSkillDTO> updateEngineerSkill(@PathVariable Long id, @RequestBody EngineerSkillDTO engineerSkillDTO) {
        return ResponseEntity.ok(engineerService.updateEngineerSkill(id, engineerSkillDTO));
    }
}