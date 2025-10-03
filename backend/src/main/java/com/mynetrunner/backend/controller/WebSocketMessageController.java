package com.mynetrunner.backend.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.mynetrunner.backend.dto.message.MessageRequest;
import com.mynetrunner.backend.dto.message.MessageResponse;
import com.mynetrunner.backend.service.MessageService;

@Controller
public class WebSocketMessageController {
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * Handle messages sent to /app/chat
     * Client sends message here, server routes to recipient
     */
    @MessageMapping("/chat")
    public void sendMessage(@Payload MessageRequest messageRequest, Principal principal) {
        try {
            // For now, we'll need to pass senderId manually
            // In Phase 2, we'll extract this from JWT token in Principal
            // Temporarily using receiverId as a placeholder - you'll fix this with proper auth
            
            // Save message temporarily
            MessageResponse response = messageService.sendMessage(
                messageRequest.getReceiverId(), // TEMP: Replace with actual senderId from JWT
                messageRequest
            );
            
            // Send message to specific user's queue
            messagingTemplate.convertAndSend(
                "/topic/messages/" + messageRequest.getReceiverId(),
                response
            );
            
            // Mark as delivered and delete from server immediately
            messageService.markAsDelivered(response.getId());
            
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
        }
    }
}