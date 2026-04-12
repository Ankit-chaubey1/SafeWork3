package com.cts.hazard_incident_service.controller;

import com.cts.hazard_incident_service.dto.IncidentRequestDto;
import com.cts.hazard_incident_service.projection.IncidentReportProjection;
import com.cts.hazard_incident_service.service.IIncidentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@Slf4j
public class IncidentController {

    private final IIncidentService incidentService;

    public IncidentController(IIncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping("/{hazardId}/{officerId}")
    public ResponseEntity<IncidentRequestDto> addIncident(@PathVariable Long hazardId,@PathVariable Long officerId,@Valid @RequestBody IncidentRequestDto request) {
        IncidentRequestDto savedIncident = incidentService.addIncident(hazardId, officerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIncident);
    }

    @GetMapping
    public ResponseEntity<List<IncidentReportProjection>> getIncidents() {
        List<IncidentReportProjection> incidents = incidentService.getIncidents();
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<IncidentReportProjection> getIncidentById(@PathVariable Long incidentId) {
        IncidentReportProjection incident = incidentService.getIncidentById(incidentId);
        return ResponseEntity.ok(incident);
    }

    @GetMapping("/hazard/{hazardId}")
    public ResponseEntity<IncidentReportProjection> getIncidentByHazardId(@PathVariable Long hazardId) {
        IncidentReportProjection incident = incidentService.getIncidentByHazardId(hazardId);
        return ResponseEntity.ok(incident);
    }

    @GetMapping("/officer/{officerId}")
    public ResponseEntity<List<IncidentReportProjection>> getIncidentsByOfficer(@PathVariable Long officerId) {
        List<IncidentReportProjection> incidents = incidentService.getIncidentsByOfficer(officerId);
        return ResponseEntity.ok(incidents);
    }
}