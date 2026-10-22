package com.userskillsmanagement.usersandskillsmanagement.repository;

import com.userskillsmanagement.usersandskillsmanagement.model.entity.EngineerSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EngineerSkillRepository extends JpaRepository<EngineerSkill, Long> {
}