package com.familytree.controller;

import com.familytree.entity.User;
import com.familytree.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    com.familytree.repository.RoleRepository roleRepository;

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<java.util.List<com.familytree.dto.UserResponse>> getAllUsers() {
        java.util.List<User> users = userRepository.findAll();
        java.util.List<com.familytree.dto.UserResponse> userResponses = users.stream().map(user -> {
            java.util.List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(java.util.stream.Collectors.toList());
            return new com.familytree.dto.UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.isActive(),
                    roles);
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(userResponses);
    }

    @PutMapping("/users/{userId}/activate")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        User user = userOpt.get();
        // Protection: Cannot activate/deactivate Super Admin (though activating is less
        // harmful, keeping consistency)
        boolean isSuperAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("SUPERADMIN"));
        if (isSuperAdmin) {
            return ResponseEntity.badRequest().body("Error: Cannot modify Super Admin.");
        }

        user.setActive(true);
        userRepository.save(user);

        return ResponseEntity.ok("User " + user.getUsername() + " activated successfully.");
    }

    @PutMapping("/users/{userId}/deactivate")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        User user = userOpt.get();

        // Protection: Cannot deactivate Super Admin
        boolean isSuperAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("SUPERADMIN"));
        if (isSuperAdmin) {
            return ResponseEntity.badRequest().body("Error: Cannot deactivate Super Admin.");
        }

        user.setActive(false);
        userRepository.save(user);

        return ResponseEntity.ok("User " + user.getUsername() + " deactivated successfully.");
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> changeUserRole(@PathVariable Long userId, @RequestBody String roleName) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        User user = userOpt.get();
        // Protection: Cannot change role of Super Admin
        boolean isSuperAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("SUPERADMIN"));
        if (isSuperAdmin) {
            return ResponseEntity.badRequest().body("Error: Cannot change role of Super Admin.");
        }

        // Clean the role name (remove quotes if sent as raw string, though RequestBody
        // handles JSON)
        String cleanRoleName = roleName.replaceAll("\"", "").trim();

        Optional<com.familytree.entity.Role> roleOpt = roleRepository.findByName(cleanRoleName);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Role " + cleanRoleName + " not found.");
        }

        user.getRoles().clear();
        user.getRoles().add(roleOpt.get());
        userRepository.save(user);

        return ResponseEntity.ok("User " + user.getUsername() + " role updated to " + cleanRoleName);
    }
}
