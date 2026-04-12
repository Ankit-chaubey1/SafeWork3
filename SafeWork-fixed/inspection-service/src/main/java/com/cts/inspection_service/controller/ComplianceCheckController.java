package com.cts.inspection_service.controller;

import com.cts.inspection_service.Dto.ComplianceRequestDTO;
import com.cts.inspection_service.Dto.ComplianceResponseDTO;
import com.cts.inspection_service.Service.IComplianceCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inspections/compliance-checks")
@RequiredArgsConstructor
public class ComplianceCheckController {

    private final IComplianceCheckService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<ComplianceResponseDTO> create(@RequestBody ComplianceRequestDTO dto) {
        return new ResponseEntity<>(service.createCheck(dto), HttpStatus.CREATED);
    }

    @GetMapping("/inspection/{inspectionId}")
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<List<ComplianceResponseDTO>> getByInspection(@PathVariable Long inspectionId) {
        return ResponseEntity.ok(service.getChecksByInspectionId(inspectionId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<List<ComplianceResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllChecks());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<ComplianceResponseDTO> update(@PathVariable Long id,
                                                         @RequestBody ComplianceRequestDTO dto) {
        return ResponseEntity.ok(service.updateCheck(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteCheck(id);
        return ResponseEntity.ok("Compliance check deleted successfully");
    }
}
