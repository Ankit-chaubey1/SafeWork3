package com.cts.compliance_audit_service.AuditTest;
import com.cts.compliance_audit_service.dto.UserPublicDTO;
import com.cts.compliance_audit_service.entity.Audit;
import com.cts.compliance_audit_service.enums.AuditScope;
import com.cts.compliance_audit_service.enums.AuditStatus;
import com.cts.compliance_audit_service.exception.AuditNotFoundException;
import com.cts.compliance_audit_service.exception.NoAuditFoundException;
import com.cts.compliance_audit_service.exception.ResourceNotFoundException;
import com.cts.compliance_audit_service.externalService.UserClient;
import com.cts.compliance_audit_service.repository.AuditRepository;
import com.cts.compliance_audit_service.service.AuditServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditServiceImplTest {

    @Mock
    private AuditRepository auditRepository;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private AuditServiceImpl auditService;

    private Audit sampleAudit;
    private UserPublicDTO sampleUser;

    @BeforeEach
    void setUp() {
        sampleAudit = new Audit();
        sampleAudit.setAuditId(1L);
        sampleAudit.setOfficerId(101L);
        sampleAudit.setAuditScope(AuditScope.FULL_SITE);
        sampleAudit.setAuditStatus(AuditStatus.Open);
        sampleAudit.setAuditDate(LocalDate.now());
        sampleAudit.setAuditFinding("Initial Finding");

        sampleUser = new UserPublicDTO();
        sampleUser.setUserId(101L);
        sampleUser.setUserName("John Doe");
    }

    @Test
    @DisplayName("Should create audit after fetching officer name from external client")
    void createAudit_Success() {

        when(userClient.getUserById(101L)).thenReturn(sampleUser);

        auditService.createAudit(sampleAudit);

        assertThat(sampleAudit.getOfficerName()).isEqualTo("John Doe");
        verify(auditRepository, times(1)).save(sampleAudit);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when UserClient fails")
    void createAudit_UserNotFound() {

        when(userClient.getUserById(101L)).thenThrow(new RuntimeException("API Down"));

        assertThrows(ResourceNotFoundException.class, () -> auditService.createAudit(sampleAudit));
        verify(auditRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should return list of audits when database is not empty")
    void getAllAudits_Success() {
        when(auditRepository.findAll()).thenReturn(List.of(sampleAudit));

        List<Audit> result = auditService.getAllAudits();

        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("Should throw NoAuditFoundException when database is empty")
    void getAllAudits_Empty() {
        when(auditRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(NoAuditFoundException.class, () -> auditService.getAllAudits());
    }

    @Test
    @DisplayName("Should update audit and update officer name if officerId changes")
    void updateAudit_WithNewOfficer() {
        Audit updatedInfo = new Audit();
        updatedInfo.setOfficerId(102L); // Different ID
        updatedInfo.setAuditScope(AuditScope.FULL_SITE);

        UserPublicDTO newUser = new UserPublicDTO();
        newUser.setUserId(102L);
        newUser.setUserName("Jane Smith");

        when(auditRepository.findById(1L)).thenReturn(Optional.of(sampleAudit));
        when(userClient.getUserById(102L)).thenReturn(newUser);
        when(auditRepository.save(any(Audit.class))).thenReturn(sampleAudit);

        Audit result = auditService.updateAudit(1L, updatedInfo);

        assertThat(result.getOfficerName()).isEqualTo("Jane Smith");
        verify(userClient).getUserById(102L);
    }

    @Test
    @DisplayName("Should delete audit when ID exists")
    void deleteAudit_Success() {
        when(auditRepository.existsById(1L)).thenReturn(true);

        auditService.deleteAudit(1L);

        verify(auditRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent audit")
    void deleteAudit_NotFound() {
        when(auditRepository.existsById(99L)).thenReturn(false);

        assertThrows(AuditNotFoundException.class, () -> auditService.deleteAudit(99L));
    }
}
