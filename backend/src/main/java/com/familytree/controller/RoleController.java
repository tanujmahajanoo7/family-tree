package com.familytree.controller;

import com.familytree.entity.Role;
import com.familytree.entity.User;
import com.familytree.repository.RoleRepository;
import com.familytree.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (roleRepository.findByName(role.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Role already exists!");
        }
        Role savedRole = roleRepository.save(role);
        return ResponseEntity.ok(savedRole);
    }

    @PostMapping("/{roleId}/users/{userId}")
    public ResponseEntity<?> assignRoleToUser(@PathVariable Long roleId, @PathVariable Long userId) {
        Optional<Role> roleOpt = roleRepository.findById(roleId);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Role not found.");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        User user = userOpt.get();
        Role role = roleOpt.get();

        user.getRoles().add(role);
        userRepository.save(user);

        return ResponseEntity.ok("Role " + role.getName() + " assigned to user " + user.getUsername());
    }
}
