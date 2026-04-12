package com.cts.employee_service.client;

import com.cts.employee_service.dto.HazardDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "HAZARD-INCIDENT-SERVICE")
public interface HazardClient {

    @PostMapping("/hazard/postHazard/{employeeId}")
    HazardDTO createHazard(@PathVariable("employeeId") Long employeeId,
                           @RequestBody HazardDTO hazardDTO);

    @GetMapping("/hazard/employee/{id}")
    List<HazardDTO> getHazardsByEmployee(@PathVariable("id") long id);
}
