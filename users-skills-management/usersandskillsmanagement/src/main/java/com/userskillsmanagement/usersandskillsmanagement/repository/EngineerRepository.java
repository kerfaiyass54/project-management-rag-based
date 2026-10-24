package com.userskillsmanagement.usersandskillsmanagement.repository;

import com.userskillsmanagement.usersandskillsmanagement.model.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface EngineerRepository extends JpaRepository<Engineer, Long> {
    Page<Engineer> findByEngineerNameContainingIgnoreCase(String engineerName, Pageable pageable);
}