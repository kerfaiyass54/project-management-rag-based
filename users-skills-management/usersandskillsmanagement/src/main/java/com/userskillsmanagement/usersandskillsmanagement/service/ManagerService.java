package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.ManagerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ManagerService {
    Page<ManagerDTO> getManagers(Pageable pageable);
    ManagerDTO createManager(ManagerDTO managerDTO);
    void deleteManager(Long id);
    Map<String, Object> getManagerStats();
    ManagerDTO updateManager(Long id, ManagerDTO managerDTO);
    ManagerDTO getManagerByName(String managerName);
}