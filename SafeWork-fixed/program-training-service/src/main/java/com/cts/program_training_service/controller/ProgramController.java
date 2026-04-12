package com.cts.program_training_service.controller;

import com.cts.program_training_service.entity.Program;
import com.cts.program_training_service.service.IProgramService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs")
@Slf4j
public class ProgramController {

    private final IProgramService service;

    @Autowired
    public ProgramController(IProgramService service) {
        this.service = service;
    }

    /** Admin / Safety Officer: view all programs */
    @GetMapping("/getallprograms")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Program>> getAllPrograms() {
        log.info("Fetching all programs");
        return ResponseEntity.ok(service.getAllPrograms());
    }

    /** Admin / Safety Officer / Employee: view a specific program */
    @GetMapping("/getprogrambyid/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER', 'EMPLOYEE')")
    public ResponseEntity<Program> getProgramById(@PathVariable Long id) {
        log.info("Fetching program ID: {}", id);
        return ResponseEntity.ok(service.getProgramById(id));
    }

    /** Admin only: create a training program */
    @PostMapping("/createprogram")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createProgram(@RequestBody Program program) {
        log.info("Creating program: {}", program.getProgramTitle());
        Program saved = service.createProgram(program);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Program created successfully",
                "data", saved
        ));
    }

    /** Admin only: update a program */
    @PutMapping("/updateprogrambyid/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> updateProgram(@PathVariable Long id, @RequestBody Program program) {
        log.info("Updating program ID: {}", id);
        Program updated = service.updateProgram(id, program);
        return ResponseEntity.ok(Map.of(
                "message", "Program updated successfully",
                "data", updated
        ));
    }

    /** Admin only: delete a program */
    @DeleteMapping("/deleteprogrambyid/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteProgram(@PathVariable Long id) {
        log.info("Deleting program ID: {}", id);
        service.deleteProgram(id);
        return ResponseEntity.ok(Map.of("message", "Program deleted successfully"));
    }
}
