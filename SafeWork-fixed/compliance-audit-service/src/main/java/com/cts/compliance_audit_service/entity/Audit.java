package com.cts.compliance_audit_service.entity;

import com.cts.compliance_audit_service.enums.AuditScope;
import com.cts.compliance_audit_service.enums.AuditStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "audit")
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long auditId;


    @NotNull(message = "Audit scope is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditScope auditScope;


    @NotBlank(message = "Audit finding cannot be blank")
    @Column(nullable = false, length = 255)
    private String auditFinding;


    @NotNull(message = "Audit date is mandatory")
    @PastOrPresent(message = "Audit date cannot be in the future")
    @Column(nullable = false)
    private LocalDate auditDate;


    @NotNull(message = "Audit status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditStatus auditStatus;



    @Column(name = "officer_id", nullable = false)
    private Long officerId;

    @Column(name = "officer_name")
    private String officerName;

}
