package com.cts.program_training_service.service;

import com.cts.program_training_service.client.EmployeeClient;
import com.cts.program_training_service.dto.EmployeeResponseDTO;
import com.cts.program_training_service.entity.Training;
import com.cts.program_training_service.exception.TrainingNotFoundException;
import com.cts.program_training_service.repository.TrainingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class TrainingServiceImpl implements ITrainingService {

    private final TrainingRepository repository;
    private final EmployeeClient employeeClient;

    @Autowired
    public TrainingServiceImpl(TrainingRepository repository, EmployeeClient employeeClient) {
        this.repository = repository;
        this.employeeClient = employeeClient;
    }

    @Override
    public List<Training> getAllTrainings() {
        log.info("Fetching all training records");
        return repository.findAll();
    }

    @Override
    public Training getTrainingById(Long id) {
        log.info("Fetching training with ID: {}", id);
        return repository.findById(id).orElseThrow(() -> new TrainingNotFoundException(id));
    }

    @Override
    public Training createTraining(Training training) {
        log.info("Creating training record for employee: {}", training.getEmployeeId());
        if (training == null) throw new IllegalArgumentException("Training cannot be null");
        return repository.save(training);
    }

    @Override
    public Training updateTraining(Long id, Training training) {
        log.info("Updating training ID: {}", id);
        Training existing = getTrainingById(id);
        existing.setTrainingCompletionDate(training.getTrainingCompletionDate());
        existing.setTrainingStatus(training.getTrainingStatus());
        existing.setProgramId(training.getProgramId());
        existing.setEmployeeId(training.getEmployeeId());
        return repository.save(existing);
    }

    @Override
    public void deleteTraining(Long id) {
        log.info("Deleting training ID: {}", id);
        Training training = getTrainingById(id);
        repository.delete(training);
    }

    @Override
    public List<Training> getTrainingsByEmployee(Long employeeId) {
        log.info("Fetching trainings for employee ID: {}", employeeId);
        return repository.findByEmployeeId(employeeId);
    }

    @Override
    public EmployeeResponseDTO getEmployeeDetails(Long employeeId) {
        log.info("Fetching employee details for ID: {}", employeeId);
        return employeeClient.getEmployeeById(employeeId);
    }
}
