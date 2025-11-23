package com.example.ProjectManagement.service;

import com.example.ProjectManagement.model.User;
import com.example.ProjectManagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register user with hashed password
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Find user by username
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    // Find user by ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Check login credentials
    public boolean checkLogin(String username, String rawPassword) {
        Optional<User> existingUserOpt = findByUsername(username);
        return existingUserOpt.map(user -> passwordEncoder.matches(rawPassword, user.getPassword())).orElse(false);
    }
}
