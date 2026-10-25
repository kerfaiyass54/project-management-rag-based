package com.teamsprojects.management.repository;

import com.teamsprojects.management.entity.Team;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findAllByOrderByNameAsc();
    boolean existsByMemberIdsContaining(String memberId);
    List<Team> findByMemberIdsContaining(String memberId);
}
