package com.mynetrunner.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mynetrunner.backend.dto.AuthResponse;
import com.mynetrunner.backend.exception.InvalidCredentialsException;
import com.mynetrunner.backend.exception.UserAlreadyExistsException;
import com.mynetrunner.backend.model.User;
import com.mynetrunner.backend.repository.UserRepository;
import com.mynetrunner.backend.util.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(String username, String password) {
        // Check if user already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException("Username '" + username + "' is already taken");
        }

        // Create new user
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(hashedPassword);
        User savedUser = userRepository.save(user);  // Save and get back the user with ID

        // Generate JWT token
        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username, savedUser.getId(), "User registered successfully");
    }

    public AuthResponse login(String username, String password) {
        // Find user
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username, user.getId(), "Login successful");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}