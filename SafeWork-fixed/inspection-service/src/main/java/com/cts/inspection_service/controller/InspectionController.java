package com.cts.inspection_service.controller;

import com.cts.inspection_service.Dto.InspectionRequestDTO;
import com.cts.inspection_service.Dto.InspectionResponseDTO;
import com.cts.inspection_service.Service.IInspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inspections")
@RequiredArgsConstructor
public class InspectionController {

    private final IInspectionService service;

    /** Safety Officer / Admin: create inspection */
    @PostMapping
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<InspectionResponseDTO> create(@RequestBody InspectionRequestDTO dto) {
        return ResponseEntity.ok(service.createInspection(dto));
    }

    /** Safety Officer / Admin: get all inspections */
    @GetMapping
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<List<InspectionResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllInspections());
    }

    /** Safety Officer / Admin: get inspection by ID */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<InspectionResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getInspectionById(id));
    }

    /** Safety Officer / Admin: delete inspection */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteInspection(id);
        return ResponseEntity.ok("Deleted Successfully");
    }
}
