package com.cts.hazard_incident_service.controller;

import com.cts.hazard_incident_service.dto.HazardRequestDto;
import com.cts.hazard_incident_service.enums.HazardStatus;
import com.cts.hazard_incident_service.enums.NotificationCategory;
import com.cts.hazard_incident_service.feignClient.NotificationClient;
import com.cts.hazard_incident_service.feignClient.UserClient;
import com.cts.hazard_incident_service.projection.HazardReportProjection;
import com.cts.hazard_incident_service.service.IHazardService;
import com.cts.hazard_incident_service.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hazard")
@Slf4j
public class HazardController {

    @Autowired
    private IHazardService hazardService;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Employee: report a new hazard.
     * Automatically notifies all Hazard Officers.
     */
    @PostMapping("/postHazard/{employeeId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<HazardRequestDto> addHazard(
            @PathVariable Long employeeId,
            @Valid @RequestBody HazardRequestDto request,
            HttpServletRequest httpRequest) {

        log.info("Hazard report from employeeId: {}", employeeId);
        HazardRequestDto savedHazard = hazardService.addHazard(employeeId, request);

        // Notify Hazard Officers
        try {
            List<Long> hazardOfficerIds = userClient.getUserIdsByRole("HAZARD_OFFICER");
            for (Long officerId : hazardOfficerIds) {
                notificationClient.createNotification(
                        officerId,
                        employeeId,
                        "New hazard reported by Employee #" + employeeId + ": " + request.getHazardDescription(),
                        NotificationCategory.HAZARD_REPORTED
                );
            }
            log.info("Notified {} hazard officers", hazardOfficerIds.size());
        } catch (Exception e) {
            log.warn("Failed to send hazard notifications: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedHazard);
    }

    /** Hazard Officer / Admin: view all hazards */
    @GetMapping("/getAllHazard")
    @PreAuthorize("hasAnyRole('HAZARD_OFFICER', 'ADMIN')")
    public ResponseEntity<List<HazardReportProjection>> getAllHazards() {
        return ResponseEntity.ok(hazardService.getAllHazards());
    }

    /** Hazard Officer / Admin / Employee: view hazard by ID */
    @GetMapping("/getById/{hazardId}")
    @PreAuthorize("hasAnyRole('HAZARD_OFFICER', 'ADMIN', 'EMPLOYEE')")
    public ResponseEntity<HazardReportProjection> findByHazardId(@PathVariable Long hazardId) {
        return ResponseEntity.ok(hazardService.getHazardById(hazardId));
    }

    /** Employee: delete own pending hazard */
    @DeleteMapping("/delete/{hazardId}/{employeeId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<String> deleteHazard(
            @PathVariable Long hazardId,
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(hazardService.deleteHazard(hazardId, employeeId));
    }

    /**
     * Employee: update own pending hazard.
     * Notifies the employee that their hazard was updated.
     */
    @PutMapping("/update/{hazardId}/{employeeId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HAZARD_OFFICER', 'ADMIN')")
    public ResponseEntity<HazardRequestDto> updateHazard(
            @PathVariable Long hazardId,
            @PathVariable Long employeeId,
            @Valid @RequestBody HazardRequestDto hazardRequestDto,
            HttpServletRequest httpRequest) {

        HazardRequestDto updated = hazardService.updateHazard(hazardId, employeeId, hazardRequestDto);

        // Notify the employee that their hazard has been updated
        try {
            String role = jwtUtil.extractRole(httpRequest.getHeader("Authorization").substring(7));
            if ("HAZARD_OFFICER".equals(role) || "ADMIN".equals(role)) {
                notificationClient.createNotification(
                        employeeId,
                        hazardId,
                        "Your hazard report #" + hazardId + " has been updated by a Hazard Officer.",
                        NotificationCategory.HAZARD_UPDATED
                );
            }
        } catch (Exception e) {
            log.warn("Failed to send hazard update notification: {}", e.getMessage());
        }

        return ResponseEntity.ok(updated);
    }

    /** Employee: view own hazards; Hazard Officer/Admin: view any employee's hazards */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HAZARD_OFFICER', 'ADMIN')")
    public ResponseEntity<List<HazardReportProjection>> getHazardsByEmployee(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(hazardService.getHazardsByEmployee(employeeId));
    }

    /** Hazard Officer / Admin: filter hazards by status */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('HAZARD_OFFICER', 'ADMIN')")
    public ResponseEntity<List<HazardReportProjection>> getHazardsByStatus(
            @PathVariable HazardStatus status) {
        return ResponseEntity.ok(hazardService.getHazardsByStatus(status));
    }

    /** Hazard Officer / Admin: summary stats */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('HAZARD_OFFICER', 'ADMIN')")
    public ResponseEntity<Map<String, Long>> getHazardSummary() {
        return ResponseEntity.ok(hazardService.getHazardSummary());
    }
}
