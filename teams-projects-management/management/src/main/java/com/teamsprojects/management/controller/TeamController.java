package com.teamsprojects.management.controller;

import com.teamsprojects.management.dto.*;
import com.teamsprojects.management.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) { this.teamService = teamService; }

    @GetMapping("/available-engineers")
    public List<EngineerDto> availableEngineers() {
        return teamService.getAvailableEngineers();
    }

    @PostMapping
    public TeamResponse create(@Valid @RequestBody TeamCreateRequest request) {
        return teamService.create(request);
    }

    @GetMapping
    public List<TeamResponse> getAll() { return teamService.getAll(); }

    @GetMapping("/{id}")
    public TeamResponse getById(@PathVariable String id) { return teamService.getById(id); }

    @PatchMapping("/{id}")
    public TeamResponse update(@PathVariable String id, @Valid @RequestBody TeamUpdateRequest request) {
        return teamService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { teamService.delete(id); }
}
