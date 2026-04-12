package com.cts.employee_service.entities;

import com.cts.employee_service.enums.EmployeeStatus;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employees") // Professional standard: Plural table name
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private long employeeId;


    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @Column(name = "password", nullable = false)
    private String password;

    @NotBlank(message = "Employee name is required")
    @Column(name = "employee_name")
    private String employeeName;

    @NotNull(message = "Date of Birth is required")
    @Column(name = "employee_dob")
    private LocalDate employeeDOB;

    @Column(name = "gender")
    private String employeeGender;

    @Column(name = "address", length = 500)
    private String employeeAddress;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Contact must be a 10-digit number")
    @Column(name = "contact_number")
    private String employeeContact;

    @Column(name = "department_name")
    private String employeeDepartmentName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EmployeeStatus employeeStatus;

    @Embedded
    @Valid // This triggers validation for fields inside EmployeeDocument
    private EmployeeDocument document;
}