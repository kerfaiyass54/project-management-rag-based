package com.teamsprojects.management.client;

import com.teamsprojects.management.dto.EngineerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "users-skills", url = "${clients.users-skills.url}")
public interface UsersSkillsClient {

    // ADAPT these paths/query names to the actual Users-Skills API contract.
    @GetMapping("${clients.users-skills.engineers-path:/api/users/engineers}")
    List<EngineerDto> getEngineers();

    @GetMapping("${clients.users-skills.engineers-by-ids-path:/api/users/engineers/by-ids}")
    List<EngineerDto> getEngineersByIds(@RequestParam("ids") List<String> ids);
}
