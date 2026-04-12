package com.cts.employee_service.dto;

import lombok.Data;

@Data
public class HazardDTO {
    private Long id;
    private String hazardDescription;
    private String hazardLocation;
    private Long employeeId;
    private String hazardStatus;
}
