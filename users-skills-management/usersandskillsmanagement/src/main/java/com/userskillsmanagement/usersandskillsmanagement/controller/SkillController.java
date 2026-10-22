package com.userskillsmanagement.usersandskillsmanagement.controller;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.SkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<SkillDTO> addNewSkill(@RequestBody SkillDTO skillDTO) {
        return ResponseEntity.ok(skillService.addNewSkill(skillDTO));
    }

    @GetMapping
    public ResponseEntity<Page<SkillDTO>> searchSkills(@RequestParam String skillName, Pageable pageable) {
        return ResponseEntity.ok(skillService.searchSkills(skillName, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillDTO> getSkillById(@PathVariable Long id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }
}