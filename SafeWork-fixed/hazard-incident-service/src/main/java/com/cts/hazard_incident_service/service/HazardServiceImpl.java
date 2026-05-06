package com.cts.hazard_incident_service.service;

import com.cts.hazard_incident_service.dto.HazardRequestDto;
import com.cts.hazard_incident_service.entity.Hazard;
import com.cts.hazard_incident_service.enums.HazardStatus;
import com.cts.hazard_incident_service.exception.EmployeeNotFoundException;
import com.cts.hazard_incident_service.exception.HazardNotFoundException;
import com.cts.hazard_incident_service.exception.IncidentAlreadyReportedException;
import com.cts.hazard_incident_service.exception.InvalidEmployeeException;
import com.cts.hazard_incident_service.exception.ServiceUnavailableException;
import com.cts.hazard_incident_service.feignClient.EmployeeClient;
import com.cts.hazard_incident_service.projection.HazardReportProjection;
import com.cts.hazard_incident_service.repository.HazardRepository;

import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class HazardServiceImpl implements IHazardService {

    private final HazardRepository hazardRepository;
    private final EmployeeClient employeeClient;

    @Autowired
    public HazardServiceImpl(
            HazardRepository hazardRepository,
            EmployeeClient employeeClient
    ) {
        this.hazardRepository = hazardRepository;
        this.employeeClient = employeeClient;
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<HazardReportProjection> getAllHazards() {
        log.info("Fetching all hazards");
        List<HazardReportProjection> hazards = hazardRepository.getAllHazards();
        log.info("Total hazards fetched: {}", hazards.size());
        return hazards;
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public HazardReportProjection getHazardById(Long hazardId) {

        log.info("Fetching hazard with id: {}", hazardId);

        HazardReportProjection hazard = hazardRepository.findByHazardId(hazardId)
                .orElseThrow(() -> {
                    log.warn("Hazard not found with id: {}", hazardId);
                    return new HazardNotFoundException(hazardId);
                });

        log.info("Hazard found with id: {}", hazardId);
        return hazard;
    }

    @Override
    @Transactional
    public HazardRequestDto addHazard(Long employeeId, HazardRequestDto dto) {

        log.info("Attempting to create hazard for employeeId: {}", employeeId);

        try {
            employeeClient.getEmployeeById(employeeId);
            log.info("Employee validation successful for employeeId: {}", employeeId);
        } catch (FeignException.NotFound e) {
            log.error("Employee not found with id: {}", employeeId);
            throw new EmployeeNotFoundException("No employee found with id: " + employeeId);
        } catch (FeignException e) {
            log.error("Employee service unavailable for employeeId: {}", employeeId, e);
            throw new ServiceUnavailableException("Employee service is unavailable. Please try again later.");
        }

        Hazard hazard = new Hazard();
        hazard.setHazardDescription(dto.getHazardDescription());
        hazard.setHazardLocation(dto.getHazardLocation());
        hazard.setHazardDate(LocalDate.now());
        hazard.setHazardStatus(HazardStatus.PENDING);
        hazard.setEmployeeId(employeeId);

        hazardRepository.save(hazard);

        log.info("Hazard created successfully for employeeId: {}", employeeId);
        return dto;
    }

    @Override
    @Transactional
    public HazardRequestDto updateHazard(Long hazardId, Long employeeId, HazardRequestDto dto) {

        log.info("Updating hazardId: {} by employeeId: {}", hazardId, employeeId);

        Hazard hazard = hazardRepository.findById(hazardId)
                .orElseThrow(() -> {
                    log.warn("Hazard not found for update. hazardId: {}", hazardId);
                    return new HazardNotFoundException(hazardId);
                });

        if (hazard.getHazardStatus() != HazardStatus.PENDING) {
            log.warn("Update blocked for hazardId: {} due to status: {}", hazardId, hazard.getHazardStatus());
            throw new IncidentAlreadyReportedException();
        }

        if (!hazard.getEmployeeId().equals(employeeId)) {
            log.warn("Unauthorized update attempt for hazardId: {}", hazardId);
            throw new InvalidEmployeeException("Not owner of hazard");
        }

        hazard.setHazardDescription(dto.getHazardDescription());
        hazard.setHazardLocation(dto.getHazardLocation());
        hazard.setHazardDate(LocalDate.now());

        hazardRepository.save(hazard);

        log.info("Hazard updated successfully. hazardId: {}", hazardId);
        return dto;
    }

    @Override
    @Transactional
    public String deleteHazard(Long hazardId, Long employeeId) {

        log.warn("Deleting hazardId: {} by employeeId: {}", hazardId, employeeId);

        Hazard hazard = hazardRepository.findById(hazardId)
                .orElseThrow(() -> {
                    log.warn("Hazard not found for delete. hazardId: {}", hazardId);
                    return new HazardNotFoundException(hazardId);
                });

        if (!hazard.getEmployeeId().equals(employeeId)) {
            log.warn("Unauthorized delete attempt for hazardId: {}", hazardId);
            throw new InvalidEmployeeException("Access denied");
        }

        if (hazard.getHazardStatus() != HazardStatus.PENDING) {
            log.warn("Delete blocked for hazardId: {} due to status: {}", hazardId, hazard.getHazardStatus());
            throw new IncidentAlreadyReportedException();
        }

        hazardRepository.delete(hazard);

        log.info("Hazard deleted successfully. hazardId: {}", hazardId);
        return "Hazard deleted successfully";
    }

    @Override
    public List<HazardReportProjection> getHazardsByEmployee(Long employeeId) {
        return hazardRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<HazardReportProjection> getHazardsByStatus(HazardStatus status) {
        return hazardRepository.findByHazardStatus(status);
    }

    @Override
    public Map<String, Long> getHazardSummary() {
        long total = hazardRepository.count();
        long pending = hazardRepository.findByHazardStatus(HazardStatus.PENDING).size();
        long completed = hazardRepository.findByHazardStatus(HazardStatus.COMPLETED).size();

        Map<String, Long> summary = new HashMap<>();
        summary.put("totalHazards", total);
        summary.put("pendingHazards", pending);
        summary.put("completedHazards", completed);
        return summary;
    }
}