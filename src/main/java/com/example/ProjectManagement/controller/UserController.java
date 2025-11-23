package com.example.ProjectManagement.controller;

import com.example.ProjectManagement.model.User;
import com.example.ProjectManagement.payload.LoginResponse;
import com.example.ProjectManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        // Save user; service will handle bcrypt encoding
        User savedUser = userService.registerUser(user);
        System.out.println("Saved hashed password: " + savedUser.getPassword());
        System.out.println("Raw Password: "+ user.getPassword());
        return ResponseEntity.status(201).body("User registered successfully");
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> existingUserOpt = userService.findByUsername(user.getUsername());

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            boolean matches = userService.checkLogin(user.getUsername(), user.getPassword());

            System.out.println("Frontend password: '" + user.getPassword() + "'");
            System.out.println("DB hashed password: '" + existingUser.getPassword() + "'");
            System.out.println("Password matches? " + matches);

            if (matches) {
                return ResponseEntity.ok(new LoginResponse(
                        existingUser.getId(),
                        existingUser.getUsername(),
                        existingUser.getRole().name(),
                        "Login Successful"
                ));
            }
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // Get all users (for admin/manager)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
