package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.ManagerDTO;
import com.userskillsmanagement.usersandskillsmanagement.model.entity.Manager;
import com.userskillsmanagement.usersandskillsmanagement.repository.ManagerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final ManagerRepository managerRepository;

    @Override
    public Page<ManagerDTO> getManagers(Pageable pageable) {
        return managerRepository.findAll(pageable)
                .map(manager -> new ManagerDTO(manager.getId(), manager.getManagerName(), manager.getManagerExperience(), manager.getManagementArea()));
    }

    @Override
    @CacheEvict(value = "managers", allEntries = true)
    public ManagerDTO createManager(ManagerDTO managerDTO) {
        Manager manager = new Manager();
        manager.setManagerName(managerDTO.managerName());
        manager.setManagerExperience(managerDTO.managerExperience());
        manager.setManagementArea(managerDTO.managementArea());
        Manager savedManager = managerRepository.save(manager);
        return new ManagerDTO(savedManager.getId(), savedManager.getManagerName(), savedManager.getManagerExperience(), savedManager.getManagementArea());
    }

    @Override
    @CacheEvict(value = "managers", allEntries = true)
    public void deleteManager(Long id) {
        managerRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getManagerStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalManagers", managerRepository.count());
        stats.put("mostExperienced", managerRepository.findAll().stream().max(Comparator.comparing(Manager::getManagerExperience)).orElse(null));
        return stats;
    }

    @Override
    @CacheEvict(value = "managers", allEntries = true)
    public ManagerDTO updateManager(Long id, ManagerDTO managerDTO) {
        Manager manager = managerRepository.findById(id).orElseThrow(() -> new RuntimeException("Manager not found"));
        manager.setManagerExperience(managerDTO.managerExperience());
        manager.setManagementArea(managerDTO.managementArea());
        Manager updatedManager = managerRepository.save(manager);
        return new ManagerDTO(updatedManager.getId(), updatedManager.getManagerName(), updatedManager.getManagerExperience(), updatedManager.getManagementArea());
    }
}