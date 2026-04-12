package com.cts.employee_service.client;

import com.cts.employee_service.dto.TrainingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

// Service name matches spring.application.name in program-training-service
@FeignClient(name = "PROGRAM-TRAINING-SERVICE")
public interface TrainingClient {

    // Matches /trainings/mytrainings/{employeeId} in TrainingController
    @GetMapping("/trainings/mytrainings/{id}")
    List<TrainingDTO> getTrainingsByEmployee(@PathVariable("id") long id);
}
