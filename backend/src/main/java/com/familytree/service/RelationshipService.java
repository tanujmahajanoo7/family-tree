package com.familytree.service;

import com.familytree.dto.RelationshipDTO;
import com.familytree.entity.Person;
import com.familytree.entity.Relationship;
import com.familytree.entity.User;
import com.familytree.repository.PersonRepository;
import com.familytree.repository.RelationshipRepository;
import com.familytree.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RelationshipService {

    @Autowired
    private RelationshipRepository relationshipRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username).map(User::getId).orElse(null);
        }
        return null;
    }

    @Transactional
    public Relationship addRelationship(RelationshipDTO dto) {
        Person person1 = personRepository.findById(dto.getPerson1Id())
                .orElseThrow(() -> new RuntimeException("Person 1 not found"));
        Person person2 = personRepository.findById(dto.getPerson2Id())
                .orElseThrow(() -> new RuntimeException("Person 2 not found"));

        Relationship relationship = new Relationship();
        relationship.setPerson1(person1);
        relationship.setPerson2(person2);
        relationship.setRelationshipType(dto.getRelationshipType());
        relationship.setStartDate(dto.getStartDate());
        relationship.setEndDate(dto.getEndDate());

        Long userId = getCurrentUserId();
        relationship.setCreatedBy(userId);
        relationship.setUpdatedBy(userId);

        Relationship saved = relationshipRepository.save(relationship);
        auditService.logAction("RELATIONSHIP", saved.getId(), "CREATE", userId,
                "Created relationship " + dto.getRelationshipType() + " between " + person1.getFullName() + " and "
                        + person2.getFullName());
        return saved;
    }

    @Transactional
    public void deleteRelationship(Long id) {
        Long userId = getCurrentUserId();
        auditService.logAction("RELATIONSHIP", id, "DELETE", userId, "Deleted relationship with ID: " + id);
        relationshipRepository.deleteById(id);
    }

    public List<Relationship> getRelationshipsForPerson(Long personId) {
        // This is a simplified lookup. In reality, we'd check both person1 and person2
        // columns
        return relationshipRepository.findByPerson1IdOrPerson2Id(personId, personId);
    }

    public List<Relationship> getAllRelationships() {
        return relationshipRepository.findAll();
    }
}
