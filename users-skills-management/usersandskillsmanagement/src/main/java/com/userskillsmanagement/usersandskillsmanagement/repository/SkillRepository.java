package com.userskillsmanagement.usersandskillsmanagement.repository;

import com.userskillsmanagement.usersandskillsmanagement.model.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Page<Skill> findBySkillNameContainingIgnoreCase(String skillName, Pageable pageable);
}