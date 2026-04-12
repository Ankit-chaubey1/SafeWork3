
package com.cts.inspection_service.Entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "inspections")
public class Inspection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inspectionId;

    private String inspectionLocation;
    private String inspectionFindings;
    private Date inspectionDate;
    private String inspectionStatus;

    // Stored as a simple ID to reference the User-Service
    private Long officerId;
}
