package com.teamsprojects.management.repository;

import com.teamsprojects.management.entity.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findAllByOrderByNameAsc();
    Page<Team> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByMemberIdsContaining(String memberId);
    List<Team> findByMemberIdsContaining(String memberId);
}
