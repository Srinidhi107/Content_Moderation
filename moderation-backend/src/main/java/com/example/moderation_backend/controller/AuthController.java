package com.example.moderation_backend.controller;

import java.util.Map;
import java.util.Objects;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moderation_backend.entity.User;
import com.example.moderation_backend.repository.UserRepository;
import com.example.moderation_backend.service.TokenService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final TokenService tokenService;

    public AuthController(UserRepository userRepository, TokenService tokenService){
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user){
        if (user.getEmail() != null) {
            user.setEmail(user.getEmail().trim().toLowerCase());
        }
        if (user.getUsername() != null) {
            user.setUsername(user.getUsername().trim());
        }
        if (user.getPassword() != null) {
            user.setPassword(user.getPassword().trim());
        }

        if (user.getUsername() == null || user.getUsername().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username, email, and password are required"));
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken"));
        }

        try {
            User savedUser = userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "id", savedUser.getId(),
                            "username", savedUser.getUsername(),
                            "email", savedUser.getEmail()));
        } catch (DataIntegrityViolationException ex) {
            String msg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Database error: " + msg));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "System error: " + ex.getMessage()));
        }
    }

    @PostMapping("/login")
public Map<String, Object> login(@RequestBody User user){

    String loginId = user.getEmail() == null ? "" : user.getEmail().trim();
    String password = user.getPassword() == null ? "" : user.getPassword().trim();

    // Accept either email or username from the single login field.
    User existingUser = userRepository.findByEmail(loginId.toLowerCase());
    if (existingUser == null) {
        existingUser = userRepository.findByUsername(loginId);
    }

    if(existingUser == null){
        return Map.of("authenticated", false);
    }

    if(!Objects.equals(existingUser.getPassword(), password)){
        return Map.of("authenticated", false);
    }

    // Why: Backend issues signed token; frontend must send it in Authorization header on protected APIs.
    String token = tokenService.generateToken(existingUser.getId());

    // Why: Never return password in API response payload.
    Map<String, Object> safeUser = Map.of(
            "id", existingUser.getId(),
            "username", existingUser.getUsername(),
            "email", existingUser.getEmail());

    return Map.of(
            "authenticated", true,
            "token", token,
            "user", safeUser);
}

}