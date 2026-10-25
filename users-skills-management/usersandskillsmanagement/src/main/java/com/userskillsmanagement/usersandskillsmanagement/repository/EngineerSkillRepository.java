package com.userskillsmanagement.usersandskillsmanagement.repository;

import com.userskillsmanagement.usersandskillsmanagement.model.entity.EngineerSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EngineerSkillRepository extends JpaRepository<EngineerSkill, Long> {
    List<EngineerSkill> findByEngineerId(Long engineerId);
}