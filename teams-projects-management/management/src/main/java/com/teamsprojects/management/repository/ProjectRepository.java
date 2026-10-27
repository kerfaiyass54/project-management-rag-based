package com.teamsprojects.management.repository;

import com.teamsprojects.management.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findAllByOrderByNameAsc();
    Page<Project> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
    Page<Project> findByTeamIdAndNameContainingIgnoreCaseOrTeamIdAndDescriptionContainingIgnoreCase(String teamId, String name, String teamIdAgain, String description, Pageable pageable);
    List<Project> findByTeamId(String teamId);
    long countByTeamId(String teamId);
}
