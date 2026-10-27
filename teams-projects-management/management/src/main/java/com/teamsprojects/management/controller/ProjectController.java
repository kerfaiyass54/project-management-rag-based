package com.teamsprojects.management.controller;

import com.teamsprojects.management.dto.*;
import com.teamsprojects.management.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) { this.projectService = projectService; }

    @PostMapping
    public ProjectResponse create(@Valid @RequestBody ProjectCreateRequest request) {
        return projectService.create(request);
    }

    @GetMapping
    public Page<ProjectResponse> getAll(@RequestParam(defaultValue = "") String search,
                                        @RequestParam(required = false) String teamId,
                                        Pageable pageable) {
        return projectService.getAll(search, teamId, pageable);
    }

    @GetMapping("/stats")
    public ProjectStatsResponse stats() { return projectService.stats(); }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable String id) { return projectService.getById(id); }

    @PatchMapping("/{id}")
    public ProjectResponse update(@PathVariable String id, @RequestBody ProjectUpdateRequest request) {
        return projectService.update(id, request);
    }

    @PutMapping("/{id}/team")
    public ProjectResponse assignTeam(@PathVariable String id, @Valid @RequestBody ProjectAssignTeamRequest request) {
        return projectService.assignTeam(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { projectService.delete(id); }
}
