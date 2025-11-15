package com.mynetrunner.backend.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.mynetrunner.backend.service.WebSocketSessionManager;

@Component
public class WebSocketEventListener {

    @Autowired
    private WebSocketSessionManager sessionManager;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String username = headerAccessor.getFirstNativeHeader("username");
        
        if (username != null && sessionId != null) {
            sessionManager.registerSession(username, sessionId);
            System.out.println("WebSocket connected: " + username + " with session " + sessionId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = headerAccessor.getFirstNativeHeader("username");
        
        if (username != null) {
            sessionManager.removeSession(username);
            System.out.println("WebSocket disconnected: " + username);
        }
    }
}