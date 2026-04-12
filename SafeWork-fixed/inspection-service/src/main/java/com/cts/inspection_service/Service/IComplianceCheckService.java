package com.cts.inspection_service.Service;


import com.cts.inspection_service.Dto.ComplianceRequestDTO;
import com.cts.inspection_service.Dto.ComplianceResponseDTO;
import java.util.List;

public interface IComplianceCheckService {
    ComplianceResponseDTO createCheck(ComplianceRequestDTO dto);
    List<ComplianceResponseDTO> getChecksByInspectionId(Long inspectionId);
    List<ComplianceResponseDTO> getAllChecks();
    ComplianceResponseDTO updateCheck(Long checkId, ComplianceRequestDTO details);
    void deleteCheck(Long checkId);
}