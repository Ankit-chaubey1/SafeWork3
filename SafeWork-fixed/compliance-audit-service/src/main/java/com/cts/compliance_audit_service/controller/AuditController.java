package com.cts.compliance_audit_service.controller;

import com.cts.compliance_audit_service.entity.Audit;
import com.cts.compliance_audit_service.enums.AuditScope;
import com.cts.compliance_audit_service.enums.AuditStatus;
import com.cts.compliance_audit_service.projection.AuditByIdProjection;
import com.cts.compliance_audit_service.security.JwtProvider;
import com.cts.compliance_audit_service.service.IAuditService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/audit")
public class AuditController {

    private final IAuditService auditService;
    private final JwtProvider jwtProvider;

    @Autowired
    public AuditController(IAuditService auditService, JwtProvider jwtProvider) {
        this.auditService = auditService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/createAudit")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<String> createAudit(
            @Valid @RequestBody Audit audit,
            HttpServletRequest request) {

        log.info("Request received to create audit");

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                Claims claims = jwtProvider.getClaims(authHeader.substring(7));
                Object userIdObj = claims.get("userId");
                if (userIdObj instanceof Number) {
                    audit.setOfficerId(((Number) userIdObj).longValue());
                }
            } catch (Exception e) {
                log.error("Could not extract userId from token: {}", e.getMessage());
            }
        }

        auditService.createAudit(audit);
        log.info("Audit created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body("Audit created successfully");
    }

    @PutMapping("/updateAudit/{auditId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<Audit> updateAudit(@PathVariable Long auditId, @Valid @RequestBody Audit updatedAudit) {
        log.info("Updating audit with id {}", auditId);
        Audit audit = auditService.updateAudit(auditId, updatedAudit);
        log.info("Audit {} updated successfully", auditId);
        return ResponseEntity.ok(audit);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<List<Audit>> getAllAudits() {
        log.info("Fetching all audits");
        return ResponseEntity.ok(auditService.getAllAudits());
    }

    @GetMapping("/getAuditById/{auditId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<AuditByIdProjection> getAuditById(@PathVariable Long auditId) {
        log.info("Fetching audit with id {}", auditId);
        return ResponseEntity.ok(auditService.getAuditById(auditId));
    }

    @GetMapping("/getAuditByStatus/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<List<Audit>> getAuditByStatus(@PathVariable AuditStatus status) {
        log.info("Fetching audits with status {}", status);
        return ResponseEntity.ok(auditService.getAuditByStatus(status));
    }

    @GetMapping("/getAuditByScope/{scope}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<List<Audit>> getAuditByScope(@PathVariable AuditScope scope) {
        log.info("Fetching audits with scope {}", scope);
        return ResponseEntity.ok(auditService.getAuditByScope(scope));
    }

    @GetMapping("/getAuditByOfficer/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<List<Audit>> findAuditByOfficer_UserId(@PathVariable Long userId) {
        log.info("Finding audits for officer userId {}", userId);
        return ResponseEntity.ok(auditService.findAuditByOfficerId(userId));
    }

    @DeleteMapping("/deleteAudit/{auditId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<String> deleteAudit(@PathVariable Long auditId) {
        log.info("Deleting audit with id {}", auditId);
        auditService.deleteAudit(auditId);
        return ResponseEntity.ok("Audit deleted successfully");
    }
}
