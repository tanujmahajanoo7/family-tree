package com.familytree.service;

import com.familytree.dto.PersonDTO;
import com.familytree.entity.Person;
import com.familytree.entity.User;
import com.familytree.repository.PersonRepository;
import com.familytree.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonService {

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
    public Person createPerson(PersonDTO personDTO) {
        Person person = new Person();
        mapDtoToEntity(personDTO, person);
        
        Long userId = getCurrentUserId();
        person.setCreatedBy(userId);
        person.setUpdatedBy(userId);

        Person savedPerson = personRepository.save(person);
        auditService.logAction("PERSON", savedPerson.getId(), "CREATE", userId, "Created person: " + savedPerson.getFullName());
        return savedPerson;
    }

    @Transactional
    public Person updatePerson(Long id, PersonDTO personDTO) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found"));

        mapDtoToEntity(personDTO, person);
        
        Long userId = getCurrentUserId();
        person.setUpdatedBy(userId);

        Person savedPerson = personRepository.save(person);
        auditService.logAction("PERSON", savedPerson.getId(), "UPDATE", userId, "Updated person: " + savedPerson.getFullName());
        return savedPerson;
    }

    @Transactional
    public void deletePerson(Long id) {
        Long userId = getCurrentUserId();
        auditService.logAction("PERSON", id, "DELETE", userId, "Deleted person with ID: " + id);
        personRepository.deleteById(id);
    }

    public List<Person> getAllPersons() {
        // In a real app, we might filter by the logged-in user's tree or family group
        // For now, let's return all created by the current user
        Long userId = getCurrentUserId();
        if (userId != null) {
            return personRepository.findByCreatedBy(userId);
        }
        return List.of();
    }

    public Person getPerson(Long id) {
        return personRepository.findById(id).orElseThrow(() -> new RuntimeException("Person not found"));
    }

    private void mapDtoToEntity(PersonDTO dto, Person entity) {
        entity.setFullName(dto.getFullName());
        entity.setGender(dto.getGender());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setDateOfDeath(dto.getDateOfDeath());
        entity.setIsAlive(dto.getIsAlive());
        entity.setImageUrl(dto.getImageUrl());
        entity.setContactNumber(dto.getContactNumber());
        entity.setEmail(dto.getEmail());

        if (dto.getFatherId() != null) {
            Person father = personRepository.findById(dto.getFatherId()).orElse(null);
            entity.setFather(father);
        } else {
            entity.setFather(null);
        }

        if (dto.getMotherId() != null) {
            Person mother = personRepository.findById(dto.getMotherId()).orElse(null);
            entity.setMother(mother);
        } else {
            entity.setMother(null);
        }
    }
}
