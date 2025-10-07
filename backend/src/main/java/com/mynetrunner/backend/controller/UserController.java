package com.mynetrunner.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mynetrunner.backend.model.User;
import com.mynetrunner.backend.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            
            // Convert to a simple format without sensitive data
            List<UserInfo> userInfos = users.stream()
                .map(user -> new UserInfo(user.getId(), user.getUsername()))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(userInfos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching users");
        }
    }
    
    // Simple DTO for user information
    public static class UserInfo {
        private Long id;
        private String username;
        
        public UserInfo(Long id, String username) {
            this.id = id;
            this.username = username;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
    }
}
