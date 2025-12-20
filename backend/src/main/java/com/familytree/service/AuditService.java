package com.familytree.service;

import com.familytree.entity.AuditLog;
import com.familytree.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String entityName, Long entityId, String action, Long changedBy, String details) {
        AuditLog log = new AuditLog();
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setChangedBy(changedBy);
        log.setDetails(details);
        auditLogRepository.save(log);
    }
}
