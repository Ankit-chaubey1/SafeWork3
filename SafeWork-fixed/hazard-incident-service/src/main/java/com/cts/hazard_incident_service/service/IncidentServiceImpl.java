package com.cts.hazard_incident_service.service;

import com.cts.hazard_incident_service.dto.IncidentRequestDto;
import com.cts.hazard_incident_service.entity.Hazard;
import com.cts.hazard_incident_service.entity.Incident;
import com.cts.hazard_incident_service.enums.HazardStatus;
import com.cts.hazard_incident_service.exception.HazardNotFoundException;
import com.cts.hazard_incident_service.exception.IncidentAlreadyReportedException;
import com.cts.hazard_incident_service.exception.IncidentNotFoundException;
import com.cts.hazard_incident_service.exception.ServiceUnavailableException;
import com.cts.hazard_incident_service.feignClient.UserClient;
import com.cts.hazard_incident_service.projection.IncidentReportProjection;
import com.cts.hazard_incident_service.repository.HazardRepository;
import com.cts.hazard_incident_service.repository.IncidentRepository;

import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
public class IncidentServiceImpl implements IIncidentService {

    private final IncidentRepository incidentRepository;
    private final HazardRepository hazardRepository;
    private final UserClient userClient;

    public IncidentServiceImpl(
            IncidentRepository incidentRepository,
            HazardRepository hazardRepository,
            UserClient userClient
    ) {
        this.incidentRepository = incidentRepository;
        this.hazardRepository = hazardRepository;
        this.userClient = userClient;
    }

    @Override
    public List<IncidentReportProjection> getIncidents() {
        return incidentRepository.getIncidents();
    }

    @Override
    public IncidentReportProjection getIncidentById(Long incidentId) {
        return incidentRepository.findById(incidentId)
                .map(i -> new IncidentReportProjection() {
                    public Long getIncidentId() { return i.getIncidentId(); }
                    public String getAction() { return i.getAction(); }
                    public LocalDate getIncidentDate() { return i.getIncidentDate(); }
                    public Long getOfficerId() { return i.getOfficerId(); }
                })
                .orElseThrow(() -> new IncidentNotFoundException(incidentId));
    }

    @Override
    public IncidentRequestDto addIncident(Long hazardId, Long officerId, IncidentRequestDto dto) {
        Hazard hazard = hazardRepository.findById(hazardId)
                .orElseThrow(() -> new HazardNotFoundException(hazardId));

        if (hazard.getHazardStatus() != HazardStatus.PENDING) {
            throw new IncidentAlreadyReportedException();
        }

        try {
            userClient.getUserById(officerId);
        } catch (FeignException.NotFound e) {
            throw new IncidentNotFoundException(officerId);
        } catch (FeignException e) {
            throw new ServiceUnavailableException("User service unavailable");
        }

        Incident incident = new Incident();
        incident.setAction(dto.getAction());
        incident.setIncidentDate(LocalDate.now());
        incident.setOfficerId(officerId);
        incident.setHazard(hazard);

        hazard.setHazardStatus(HazardStatus.COMPLETED);
        hazard.setIncident(incident);

        incidentRepository.save(incident);
        hazardRepository.save(hazard);

        return dto;
    }

    @Override
    public IncidentReportProjection getIncidentByHazardId(Long hazardId) {
        Incident incident = incidentRepository.findByHazard_HazardId(hazardId)
                .orElseThrow(() -> new IncidentNotFoundException(hazardId));

        return new IncidentReportProjection() {
            public Long getIncidentId() { return incident.getIncidentId(); }
            public String getAction() { return incident.getAction(); }
            public LocalDate getIncidentDate() { return incident.getIncidentDate(); }
            public Long getOfficerId() { return incident.getOfficerId(); }
        };
    }

    @Override
    public List<IncidentReportProjection> getIncidentsByOfficer(Long officerId) {
        return incidentRepository.findByOfficerId(officerId);
    }
}