package com.cts.program_training_service.client;

import com.cts.program_training_service.dto.EmployeeResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "EMPLOYEE-SERVICE")
public interface EmployeeClient {

//    @GetMapping("/employees/{id}")
//    EmployeeResponseDTO getEmployeeById(@PathVariable("id") long id);

    @GetMapping("/employees/{id}")
    EmployeeResponseDTO getEmployeeById(@PathVariable("id") Long id);
}