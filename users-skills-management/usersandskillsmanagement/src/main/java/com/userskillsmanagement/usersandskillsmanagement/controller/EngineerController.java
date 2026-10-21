package com.userskillsmanagement.usersandskillsmanagement.controller;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.EngineerSkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.service.EngineerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/engineers")
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

    @PostMapping("/assign-skill")
    public ResponseEntity<EngineerSkillDTO> assignSkillToEngineer(@RequestBody EngineerSkillDTO engineerSkillDTO) {
        return ResponseEntity.ok(engineerService.assignSkillToEngineer(engineerSkillDTO));
    }
}