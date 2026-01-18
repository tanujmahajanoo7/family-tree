package com.familytree.controller;

import com.familytree.dto.PersonDTO;
import com.familytree.entity.Person;
import com.familytree.service.FileStorageService;
import com.familytree.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/person")
public class PersonController {

    @Autowired
    private PersonService personService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(fileDownloadUri);
    }

    @PostMapping
    public ResponseEntity<Person> createPerson(@RequestBody PersonDTO personDTO) {
        return ResponseEntity.ok(personService.createPerson(personDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePerson(@PathVariable Long id, @RequestBody PersonDTO personDTO) {
        try {
            return ResponseEntity.ok(personService.updatePerson(id, personDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Long id) {
        try {
            personService.deletePerson(id);
            return ResponseEntity.ok(java.util.Map.of("message", "Person deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons() {
        return ResponseEntity.ok(personService.getAllPersons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPerson(@PathVariable Long id) {
        return ResponseEntity.ok(personService.getPerson(id));
    }
}
