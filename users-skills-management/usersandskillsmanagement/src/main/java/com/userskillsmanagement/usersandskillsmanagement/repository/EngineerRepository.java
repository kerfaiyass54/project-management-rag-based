package com.userskillsmanagement.usersandskillsmanagement.repository;

import com.userskillsmanagement.usersandskillsmanagement.model.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EngineerRepository extends JpaRepository<Engineer, Long> {
}