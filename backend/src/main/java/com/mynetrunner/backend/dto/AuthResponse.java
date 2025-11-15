package com.mynetrunner.backend.dto;

public class AuthResponse {
    private String token;
    private String username;
    private Long userId;
    private String message;

    // Constructor with userId
    public AuthResponse(String token, String username, Long userId, String message) {
        this.token = token;
        this.username = username;
        this.userId = userId;
        this.message = message;
    }

    // Old constructor for backward compatibility (if needed)
    public AuthResponse(String token, String username, String message) {
        this.token = token;
        this.username = username;
        this.userId = null;
        this.message = message;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}