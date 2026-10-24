package com.userskillsmanagement.usersandskillsmanagement.controller;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.SkillDTO;
import com.userskillsmanagement.usersandskillsmanagement.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public ResponseEntity<Page<SkillDTO>> searchSkills(
            @RequestParam(defaultValue = "", name = "search") String search,
            @RequestParam(defaultValue = "", name = "skillName") String skillName,
            Pageable pageable) {
        String query = search.isBlank() ? skillName : search;
        return ResponseEntity.ok(skillService.searchSkills(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillDTO> getSkillById(@PathVariable Long id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usage")
    public ResponseEntity<Map<String, SkillDTO>> getMostAndLeastUsedSkills() {
        return ResponseEntity.ok(skillService.getMostAndLeastUsedSkills());
    }
}