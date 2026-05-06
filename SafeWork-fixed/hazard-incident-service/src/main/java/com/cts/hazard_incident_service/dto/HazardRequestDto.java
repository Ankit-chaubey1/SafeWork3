package com.cts.hazard_incident_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class HazardRequestDto {


    @NotBlank(message = "Hazard description must not be empty")
    @Size(min = 5, max = 255, message = "Hazard description must be between 5 and 255 characters")
    private String hazardDescription;


    @NotBlank(message = "Hazard location must not be empty")
    @Size(min = 3, max = 150, message = "Hazard location must be between 3 and 150 characters")
    private String hazardLocation;


}
