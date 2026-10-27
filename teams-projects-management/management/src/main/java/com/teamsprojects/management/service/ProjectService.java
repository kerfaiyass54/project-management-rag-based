package com.teamsprojects.management.service;

import com.teamsprojects.management.config.CacheNames;
import com.teamsprojects.management.dto.*;
import com.teamsprojects.management.entity.Project;
import com.teamsprojects.management.exception.NotFoundException;
import com.teamsprojects.management.repository.ProjectRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TeamService teamService;

    public ProjectService(ProjectRepository projectRepository, TeamService teamService) {
        this.projectRepository = projectRepository;
        this.teamService = teamService;
    }

    @CacheEvict(cacheNames = {CacheNames.PROJECT_LIST, CacheNames.PROJECT_STATS}, allEntries = true)
    public ProjectResponse create(ProjectCreateRequest request) {
        if (request.teamId() != null && !teamService.exists(request.teamId())) {
            throw new NotFoundException("Team not found: " + request.teamId());
        }
        Instant now = Instant.now();
        Project project = new Project();
        project.setName(request.name().trim());
        project.setDescription(request.description());
        project.setDurationDays(request.durationDays());
        project.setTeamId(request.teamId());
        project.setRepositoryUrl(request.repositoryUrl());
        project.setCreatedAt(now);
        project.setUpdatedAt(now);
        return toResponse(projectRepository.save(project));
    }

    @Cacheable(cacheNames = CacheNames.PROJECT_DETAIL, key = "#id")
    public ProjectResponse getById(String id) {
        return toResponse(findProject(id));
    }

    @Cacheable(cacheNames = CacheNames.PROJECT_LIST, key = "'all'")
    public Page<ProjectResponse> getAll(String search, String teamId, Pageable pageable) {
        String normalized = search == null ? "" : search.trim();
        if (teamId == null || teamId.isBlank()) {
            return projectRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(normalized, normalized, pageable)
                    .map(this::toResponse);
        }
        return projectRepository.findByTeamIdAndNameContainingIgnoreCaseOrTeamIdAndDescriptionContainingIgnoreCase(
                        teamId, normalized, teamId, normalized, pageable)
                .map(this::toResponse);
    }

    // Only description, duration, and repository can be changed by this operation.
    @CacheEvict(cacheNames = {CacheNames.PROJECT_DETAIL, CacheNames.PROJECT_LIST, CacheNames.PROJECT_STATS}, allEntries = true)
    public ProjectResponse update(String id, ProjectUpdateRequest request) {
        Project project = findProject(id);
        if (request.description() != null) project.setDescription(request.description());
        if (request.durationDays() != null) project.setDurationDays(request.durationDays());
        if (request.repositoryUrl() != null) project.setRepositoryUrl(request.repositoryUrl());
        project.setUpdatedAt(Instant.now());
        return toResponse(projectRepository.save(project));
    }

    @CacheEvict(cacheNames = {CacheNames.PROJECT_DETAIL, CacheNames.PROJECT_LIST, CacheNames.PROJECT_STATS}, allEntries = true)
    public ProjectResponse assignTeam(String id, ProjectAssignTeamRequest request) {
        if (!teamService.exists(request.teamId())) throw new NotFoundException("Team not found: " + request.teamId());
        Project project = findProject(id);
        project.setTeamId(request.teamId());
        project.setUpdatedAt(Instant.now());
        return toResponse(projectRepository.save(project));
    }

    @CacheEvict(cacheNames = {CacheNames.PROJECT_DETAIL, CacheNames.PROJECT_LIST, CacheNames.PROJECT_STATS}, allEntries = true)
    public void delete(String id) {
        projectRepository.delete(findProject(id));
    }

    @Cacheable(cacheNames = CacheNames.PROJECT_STATS, key = "'all'")
    public ProjectStatsResponse stats() {
        long total = projectRepository.count();
        long assigned = projectRepository.findAll().stream().filter(p -> p.getTeamId() != null && !p.getTeamId().isBlank()).count();
        return new ProjectStatsResponse(total, assigned, total - assigned);
    }

    private Project findProject(String id) {
        return projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project not found: " + id));
    }

    private ProjectResponse toResponse(Project p) {
        return new ProjectResponse(p.getId(), p.getName(), p.getDescription(), p.getDurationDays(),
                p.getTeamId(), p.getRepositoryUrl(), p.getCreatedAt(), p.getUpdatedAt());
    }
}
