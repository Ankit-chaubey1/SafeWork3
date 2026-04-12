package com.cts.inspection_service.Service;


import com.cts.inspection_service.Dto.InspectionRequestDTO;
import com.cts.inspection_service.Dto.InspectionResponseDTO;
import com.cts.inspection_service.Entity.Inspection;
import com.cts.inspection_service.Repository.InspectionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class InspectionServiceImpl implements IInspectionService {

    @Autowired
    private InspectionRepository repository;

    @Override
    public InspectionResponseDTO createInspection(InspectionRequestDTO requestDTO) {
        log.info("Saving new inspection for location: {}", requestDTO.getInspectionLocation());
        Inspection inspection = new Inspection();
        BeanUtils.copyProperties(requestDTO, inspection);
        return mapToDTO(repository.save(inspection));
    }

    @Override
    public List<InspectionResponseDTO> getAllInspections() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public InspectionResponseDTO getInspectionById(Long id) {
        Inspection inspection = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found with ID: " + id));
        return mapToDTO(inspection);
    }

    @Override
    public InspectionResponseDTO updateInspection(Long id, InspectionRequestDTO details) {
        Inspection existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        BeanUtils.copyProperties(details, existing);
        existing.setInspectionId(id); // Ensure ID doesn't change
        return mapToDTO(repository.save(existing));
    }

    @Override
    public void deleteInspection(Long id) {
        repository.deleteById(id);
    }

    private InspectionResponseDTO mapToDTO(Inspection inspection) {
        InspectionResponseDTO dto = new InspectionResponseDTO();
        BeanUtils.copyProperties(inspection, dto);
        return dto;
    }
}