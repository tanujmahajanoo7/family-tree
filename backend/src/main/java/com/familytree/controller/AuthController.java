package com.familytree.controller;

import com.familytree.dto.JwtResponse;
import com.familytree.dto.LoginRequest;
import com.familytree.dto.MessageResponse;
import com.familytree.dto.SignupRequest;
import com.familytree.entity.User;
import com.familytree.repository.UserRepository;
import com.familytree.service.UserDetailsImpl;
import com.familytree.util.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    com.familytree.repository.RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        java.util.Set<com.familytree.entity.Role> roles = new java.util.HashSet<>();

        if (userRepository.count() == 0) {
            // First user is Admin and Active
            com.familytree.entity.Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new com.familytree.entity.Role(null, "ADMIN")));
            roles.add(adminRole);
            user.setActive(true);
        } else {
            // Subsequent users are Inactive and default to requested role or USER
            user.setActive(false);
            if (signUpRequest.getRole() == null || signUpRequest.getRole().isEmpty()) {
                com.familytree.entity.Role userRole = roleRepository.findByName("USER")
                        .orElseGet(() -> roleRepository.save(new com.familytree.entity.Role(null, "USER")));
                roles.add(userRole);
            } else {
                String roleName = signUpRequest.getRole();
                com.familytree.entity.Role userRole = roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(new com.familytree.entity.Role(null, roleName)));
                roles.add(userRole);
            }
        }

        user.setRoles(roles);

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok("No authentication found");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(userDetails);
    }
}
