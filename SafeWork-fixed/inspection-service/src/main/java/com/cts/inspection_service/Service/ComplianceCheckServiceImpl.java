package com.cts.inspection_service.Service;


import com.cts.inspection_service.Dto.ComplianceRequestDTO;
import com.cts.inspection_service.Dto.ComplianceResponseDTO;
import com.cts.inspection_service.Entity.ComplianceCheck;
import com.cts.inspection_service.Repository.ComplianceCheckRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ComplianceCheckServiceImpl implements IComplianceCheckService {

    @Autowired
    private ComplianceCheckRepository repository;

    @Override
    public ComplianceResponseDTO createCheck(ComplianceRequestDTO dto) {
        log.info("Creating compliance check for Inspection ID: {}", dto.getInspectionId());
        ComplianceCheck entity = new ComplianceCheck();
        BeanUtils.copyProperties(dto, entity);
        return mapToDTO(repository.save(entity));
    }

    @Override
    public List<ComplianceResponseDTO> getChecksByInspectionId(Long inspectionId) {
        return repository.findByInspectionId(inspectionId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplianceResponseDTO> getAllChecks() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ComplianceResponseDTO updateCheck(Long checkId, ComplianceRequestDTO details) {
        ComplianceCheck existing = repository.findById(checkId)
                .orElseThrow(() -> new RuntimeException("Check not found"));

        BeanUtils.copyProperties(details, existing, "checkId");
        return mapToDTO(repository.save(existing));
    }

    @Override
    public void deleteCheck(Long checkId) {
        if(!repository.existsById(checkId)) throw new RuntimeException("Check not found");
        repository.deleteById(checkId);
    }

    private ComplianceResponseDTO mapToDTO(ComplianceCheck entity) {
        ComplianceResponseDTO dto = new ComplianceResponseDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}