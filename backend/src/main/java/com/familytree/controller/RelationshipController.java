package com.familytree.controller;

import com.familytree.dto.RelationshipDTO;
import com.familytree.entity.Relationship;
import com.familytree.service.RelationshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/relationship")
public class RelationshipController {

    @Autowired
    private RelationshipService relationshipService;

    @PostMapping
    public ResponseEntity<Relationship> addRelationship(@RequestBody RelationshipDTO dto) {
        return ResponseEntity.ok(relationshipService.addRelationship(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRelationship(@PathVariable Long id) {
        relationshipService.deleteRelationship(id);
        return ResponseEntity.ok("Relationship deleted successfully");
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<Relationship>> getRelationships(@PathVariable Long personId) {
        return ResponseEntity.ok(relationshipService.getRelationshipsForPerson(personId));
    }

    @GetMapping
    public ResponseEntity<List<Relationship>> getAllRelationships() {
        return ResponseEntity.ok(relationshipService.getAllRelationships());
    }
}
