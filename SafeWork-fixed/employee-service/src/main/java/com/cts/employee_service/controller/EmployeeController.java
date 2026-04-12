package com.cts.employee_service.controller;

import com.cts.employee_service.dto.EmployeeResponseDTO;
import com.cts.employee_service.dto.HazardDTO;
import com.cts.employee_service.dto.TrainingDTO;
import com.cts.employee_service.entities.Employee;
import com.cts.employee_service.entities.EmployeeDocument;
import com.cts.employee_service.repositories.EmployeeRepository;
import com.cts.employee_service.service.IEmployeeService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;

@RestController
@RequestMapping("/employees")
@Slf4j
public class EmployeeController {

    @Autowired
    private IEmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * Public: Register a new Employee.
     * This also triggers creation of a User record in User Service.
     * LOGIN must be done via POST /users/login (User Service).
     */
    @PostMapping("/register")
    public ResponseEntity<Employee> register(@Valid @RequestBody Employee employee) {
        log.info("Registering new employee: {}", employee.getEmail());
        return new ResponseEntity<>(employeeService.registerEmployee(employee), HttpStatus.CREATED);
    }

    /** Admin only: Get all employees */
    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAll() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    /**
     * Employee: can only fetch their own record (verified via JWT email).
     * Admin / other officers: can fetch any.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'HAZARD_OFFICER', 'SAFETY_OFFICER', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<?> getEmployee(@PathVariable long id, HttpServletRequest request) {
        String role = extractRole(request);
        if ("EMPLOYEE".equals(role)) {
            String tokenEmail = extractEmail(request);
            Employee emp = employeeRepository.findById(id).orElse(null);
            if (emp == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
            }
            if (!emp.getEmail().equalsIgnoreCase(tokenEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You can only view your own profile");
            }
        }
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    /**
     * Employee only: Report a hazard for themselves.
     * The employeeId in the request body MUST match the logged-in employee's id.
     */
    @PostMapping("/hazard/report")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> reportHazard(@Valid @RequestBody HazardDTO hazardDTO,
                                          HttpServletRequest request) {
        String tokenEmail = extractEmail(request);
        Employee emp = employeeRepository.findByEmail(tokenEmail).orElse(null);
        if (emp == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Employee not found for token");
        }
        // Force the hazard to be filed under the logged-in employee
        hazardDTO.setEmployeeId(emp.getEmployeeId());
        return new ResponseEntity<>(employeeService.reportHazard(hazardDTO), HttpStatus.CREATED);
    }

    /** Employee (own) or Admin/Hazard Officer */
    @GetMapping("/{id}/hazards")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'HAZARD_OFFICER')")
    public ResponseEntity<?> getHazards(@PathVariable long id, HttpServletRequest request) {
        if ("EMPLOYEE".equals(extractRole(request))) {
            if (!isOwnRecord(id, request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: own data only");
            }
        }
        return ResponseEntity.ok(employeeService.getHazardsByEmployee(id));
    }

    /** Employee (own) or Admin/Safety Officer */
    @GetMapping("/{id}/trainings")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SAFETY_OFFICER')")
    public ResponseEntity<?> getMyTrainings(@PathVariable long id, HttpServletRequest request) {
        if ("EMPLOYEE".equals(extractRole(request))) {
            if (!isOwnRecord(id, request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: own data only");
            }
        }
        return ResponseEntity.ok(employeeService.getTrainingsByEmployee(id));
    }

    /** Employee (own) or Admin */
    @GetMapping("/{id}/document")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<?> getDocument(@PathVariable long id, HttpServletRequest request) {
        if ("EMPLOYEE".equals(extractRole(request))) {
            if (!isOwnRecord(id, request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: own data only");
            }
        }
        return ResponseEntity.ok(employeeService.getEmployeeDocument(id));
    }

    // ---- JWT helper methods ----

    private boolean isOwnRecord(long id, HttpServletRequest request) {
        String tokenEmail = extractEmail(request);
        Employee emp = employeeRepository.findById(id).orElse(null);
        return emp != null && emp.getEmail().equalsIgnoreCase(tokenEmail);
    }

    private String extractEmail(HttpServletRequest request) {
        Claims claims = getClaims(request);
        return claims != null ? claims.getSubject() : null;
    }

    private String extractRole(HttpServletRequest request) {
        Claims claims = getClaims(request);
        return claims != null ? claims.get("role", String.class) : null;
    }

    private Claims getClaims(HttpServletRequest request) {
        try {
            String auth = request.getHeader("Authorization");
            if (auth == null || !auth.startsWith("Bearer ")) return null;
            String token = auth.substring(7);
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (Exception e) {
            log.error("Failed to parse JWT: {}", e.getMessage());
            return null;
        }
    }
}
