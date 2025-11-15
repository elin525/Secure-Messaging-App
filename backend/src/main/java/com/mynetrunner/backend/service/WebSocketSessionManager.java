package com.mynetrunner.backend.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class WebSocketSessionManager {
    
    // Map username to their WebSocket session ID
    private final Map<String, String> userSessions = new ConcurrentHashMap<>();
    
    public void registerSession(String username, String sessionId) {
        userSessions.put(username, sessionId);
        System.out.println("Registered session for " + username + ": " + sessionId);
    }
    
    public void removeSession(String username) {
        String sessionId = userSessions.remove(username);
        System.out.println("Removed session for " + username + ": " + sessionId);
    }
    
    public String getSessionId(String username) {
        return userSessions.get(username);
    }
    
    public boolean isUserConnected(String username) {
        return userSessions.containsKey(username);
    }
}