package com.mynetrunner.backend.controller;

import com.mynetrunner.backend.dto.LoginRequest;
import com.mynetrunner.backend.dto.RegisterRequest;
import com.mynetrunner.backend.dto.AuthResponse;
import com.mynetrunner.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request.getUsername(), request.getPassword());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request.getUsername(), request.getPassword());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}