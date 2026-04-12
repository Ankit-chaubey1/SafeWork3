package com.cts.program_training_service.controller;

import com.cts.program_training_service.client.EmployeeClient;
import com.cts.program_training_service.client.NotificationClient;
import com.cts.program_training_service.dto.EmployeeResponseDTO;
import com.cts.program_training_service.entity.Training;
import com.cts.program_training_service.service.ITrainingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/trainings")
@Slf4j
public class TrainingController {

    private final ITrainingService service;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    public TrainingController(ITrainingService service) {
        this.service = service;
    }

    /** Admin / Safety Officer: get all trainings */
    @GetMapping("/getalltrainings")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Training>> getAllTrainings() {
        log.info("Fetching all trainings");
        return ResponseEntity.ok(service.getAllTrainings());
    }

    /** Admin / Safety Officer / Employee: get training by ID */
    @GetMapping("/gettrainingbyid/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER', 'EMPLOYEE')")
    public ResponseEntity<Training> getTrainingById(@PathVariable Long id) {
        log.info("Fetching training with ID: {}", id);
        return ResponseEntity.ok(service.getTrainingById(id));
    }

    /** Admin only: create a training assignment */
    @PostMapping("/createtraining")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createTraining(@RequestBody Training training) {
        log.info("Creating new training assignment for employee: {}", training.getEmployeeId());
        Training savedTraining = service.createTraining(training);

        // Notify the assigned employee
        if (training.getEmployeeId() != null) {
            try {
                notificationClient.createNotification(
                        training.getEmployeeId(),
                        savedTraining.getId(),
                        "You have been assigned a new training program. Please check your training schedule.",
                        "TRAINING_ASSIGNED"
                );
                log.info("Training assignment notification sent to employee {}", training.getEmployeeId());
            } catch (Exception e) {
                log.warn("Failed to send training notification: {}", e.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Training created successfully",
                "data", savedTraining
        ));
    }

    /** Admin only: update training */
    @PutMapping("/updatetrainingbyid/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> updateTraining(@PathVariable Long id,
                                                  @RequestBody Training training) {
        log.info("Updating training with ID: {}", id);
        Training updatedTraining = service.updateTraining(id, training);
        return ResponseEntity.ok(Map.of(
                "message", "Training updated successfully",
                "data", updatedTraining
        ));
    }

    /** Admin only: delete training */
    @DeleteMapping("/deletetrainingbyid/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteTraining(@PathVariable Long id) {
        log.info("Deleting training with ID: {}", id);
        service.deleteTraining(id);
        return ResponseEntity.ok(Map.of("message", "Training deleted successfully"));
    }

    /** Admin / Safety Officer: get employee details */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeDetails(@PathVariable Long employeeId) {
        log.info("Fetching employee details for ID: {}", employeeId);
        return ResponseEntity.ok(service.getEmployeeDetails(employeeId));
    }

    /** Employee: get own assigned trainings */
    @GetMapping("/mytrainings/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Training>> getMyTrainings(@PathVariable Long employeeId) {
        log.info("Fetching trainings for employee ID: {}", employeeId);
        return ResponseEntity.ok(service.getTrainingsByEmployee(employeeId));
    }
}
