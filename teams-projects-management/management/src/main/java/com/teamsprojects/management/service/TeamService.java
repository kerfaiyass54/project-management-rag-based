package com.teamsprojects.management.service;

import com.teamsprojects.management.client.UsersSkillsClient;
import com.teamsprojects.management.config.CacheNames;
import com.teamsprojects.management.dto.*;
import com.teamsprojects.management.entity.Team;
import com.teamsprojects.management.exception.ConflictException;
import com.teamsprojects.management.exception.NotFoundException;
import com.teamsprojects.management.repository.TeamRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TeamService {
    private final TeamRepository teamRepository;
    private final UsersSkillsClient usersSkillsClient;

    public TeamService(TeamRepository teamRepository, UsersSkillsClient usersSkillsClient) {
        this.teamRepository = teamRepository;
        this.usersSkillsClient = usersSkillsClient;
    }

    @Cacheable(cacheNames = CacheNames.AVAILABLE_ENGINEERS, key = "'all'")
    public List<EngineerDto> getAvailableEngineers() {
        List<EngineerDto> allEngineers = usersSkillsClient.getEngineers();
        Set<String> assigned = teamRepository.findAll().stream()
                .flatMap(team -> team.getMemberIds().stream())
                .collect(Collectors.toSet());

        return allEngineers.stream()
                .filter(Objects::nonNull)
                .filter(e -> e.id() != null && !assigned.contains(e.id()))
                .filter(this::isEngineer)
                .toList();
    }

    @CacheEvict(cacheNames = {CacheNames.TEAM_LIST, CacheNames.AVAILABLE_ENGINEERS}, allEntries = true)
    public TeamResponse create(TeamCreateRequest request) {
        List<String> ids = normalizeIds(request.memberIds());
        validateIdsAreEngineers(ids);
        ensureUnassigned(ids, null);

        Instant now = Instant.now();
        Team team = new Team(request.name().trim(), ids);
        team.setCreatedAt(now);
        team.setUpdatedAt(now);
        return toResponse(teamRepository.save(team), null);
    }

    @Cacheable(cacheNames = CacheNames.TEAM_DETAIL, key = "#id")
    public TeamResponse getById(String id) {
        Team team = findTeam(id);
        List<EngineerDto> members = fetchMembers(team.getMemberIds());
        return toResponse(team, members);
    }

    @Cacheable(cacheNames = CacheNames.TEAM_LIST, key = "'all'")
    public List<TeamResponse> getAll() {
        return teamRepository.findAllByOrderByNameAsc().stream()
                .map(team -> toResponse(team, null))
                .toList();
    }

    @CacheEvict(cacheNames = {CacheNames.TEAM_DETAIL, CacheNames.TEAM_LIST, CacheNames.AVAILABLE_ENGINEERS}, allEntries = true)
    public TeamResponse update(String id, TeamUpdateRequest request) {
        Team team = findTeam(id);
        List<String> current = new ArrayList<>(team.getMemberIds());
        Set<String> remove = new HashSet<>(safe(request.removeMemberIds()));
        Set<String> add = new LinkedHashSet<>(safe(request.addMemberIds()));

        // A member cannot be both added and removed in one request.
        Set<String> overlap = new HashSet<>(add);
        overlap.retainAll(remove);
        if (!overlap.isEmpty()) {
            throw new ConflictException("An engineer cannot be added and removed in the same update.");
        }

        current.removeIf(remove::contains);
        for (String memberId : add) {
            if (!current.contains(memberId)) current.add(memberId);
        }

        validateIdsAreEngineers(current);
        ensureUnassigned(add.stream().filter(x -> !remove.contains(x)).toList(), id);

        team.setName(request.name().trim());
        team.setMemberIds(current);
        team.setUpdatedAt(Instant.now());
        Team saved = teamRepository.save(team);
        return toResponse(saved, fetchMembers(saved.getMemberIds()));
    }

    @CacheEvict(cacheNames = {CacheNames.TEAM_DETAIL, CacheNames.TEAM_LIST, CacheNames.AVAILABLE_ENGINEERS}, allEntries = true)
    public void delete(String id) {
        Team team = findTeam(id);
        teamRepository.delete(team);
    }

    public boolean exists(String id) {
        return teamRepository.existsById(id);
    }

    private Team findTeam(String id) {
        return teamRepository.findById(id).orElseThrow(() -> new NotFoundException("Team not found: " + id));
    }

    private void ensureUnassigned(List<String> ids, String exceptTeamId) {
        for (String memberId : ids) {
            List<Team> teams = teamRepository.findByMemberIdsContaining(memberId);
            boolean assignedElsewhere = teams.stream().anyMatch(t -> !Objects.equals(t.getId(), exceptTeamId));
            if (assignedElsewhere) throw new ConflictException("Engineer is already assigned to a team: " + memberId);
        }
    }

    private void validateIdsAreEngineers(List<String> ids) {
        if (ids.isEmpty()) return;
        List<EngineerDto> found = usersSkillsClient.getEngineersByIds(ids);
        Set<String> valid = found == null ? Set.of() : found.stream()
                .filter(Objects::nonNull).filter(this::isEngineer)
                .map(EngineerDto::id).filter(Objects::nonNull).collect(Collectors.toSet());
        if (!valid.containsAll(ids)) {
            Set<String> invalid = new HashSet<>(ids);
            invalid.removeAll(valid);
            throw new ConflictException("Unknown or non-engineer IDs: " + invalid);
        }
    }

    private List<EngineerDto> fetchMembers(List<String> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        List<EngineerDto> result = usersSkillsClient.getEngineersByIds(ids);
        Map<String, EngineerDto> byId = result == null ? Map.of() : result.stream()
                .filter(Objects::nonNull).filter(e -> e.id() != null)
                .collect(Collectors.toMap(EngineerDto::id, Function.identity(), (a, b) -> a));
        // Preserve the membership order; an upstream missing user is omitted from the profile array.
        return ids.stream().map(byId::get).filter(Objects::nonNull).toList();
    }

    private TeamResponse toResponse(Team team, List<EngineerDto> members) {
        return new TeamResponse(team.getId(), team.getName(), List.copyOf(team.getMemberIds()),
                members, team.getCreatedAt(), team.getUpdatedAt());
    }

    private boolean isEngineer(EngineerDto engineer) {
        return engineer.role() != null && engineer.role().equalsIgnoreCase("ENGINEER");
    }

    private List<String> normalizeIds(List<String> ids) {
        if (ids == null) return List.of();
        List<String> normalized = ids.stream().filter(Objects::nonNull).map(String::trim)
                .filter(s -> !s.isBlank()).distinct().toList();
        if (normalized.size() != ids.size()) {
            throw new ConflictException("Member IDs must be nonblank and unique.");
        }
        return normalized;
    }

    private List<String> safe(List<String> ids) {
        return ids == null ? List.of() : normalizeIds(ids);
    }
}
