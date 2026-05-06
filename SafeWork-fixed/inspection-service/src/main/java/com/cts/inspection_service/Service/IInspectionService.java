
package com.cts.inspection_service.Service;


import com.cts.inspection_service.Dto.InspectionRequestDTO;
import com.cts.inspection_service.Dto.InspectionResponseDTO;
import java.util.List;

public interface IInspectionService {
    InspectionResponseDTO createInspection(InspectionRequestDTO requestDTO);
    List<InspectionResponseDTO> getAllInspections();
    InspectionResponseDTO getInspectionById(Long id);
    InspectionResponseDTO updateInspection(Long id, InspectionRequestDTO details);
    void deleteInspection(Long id);
}
