package com.teamsprojects.management.repository;

import com.teamsprojects.management.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findAllByOrderByNameAsc();
    List<Project> findByTeamId(String teamId);
    long countByTeamId(String teamId);
}
