package com.mynetrunner.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.mynetrunner.backend.dto.message.MessageRequest;
import com.mynetrunner.backend.dto.message.MessageResponse;
import com.mynetrunner.backend.exception.MessageDeliveryException;
import com.mynetrunner.backend.exception.UserNotFoundException;
import com.mynetrunner.backend.model.Message;
import com.mynetrunner.backend.model.User;
import com.mynetrunner.backend.repository.UserRepository;
import com.mynetrunner.backend.service.MessageService;
import com.mynetrunner.backend.service.WebSocketSessionManager;

import jakarta.validation.Valid;

@Controller
public class WebSocketMessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebSocketSessionManager sessionManager;

    @MessageMapping("/send")
    public void sendMessage(@Valid @Payload MessageRequest request) {
        try {
            System.out.println("=== RECEIVED MESSAGE REQUEST ===");
            System.out.println("From: " + request.getSenderUsername());
            System.out.println("To: " + request.getRecipientUsername());
            
            // Find sender by username
            User sender = userRepository.findByUsername(request.getSenderUsername())
                .orElseThrow(() -> new UserNotFoundException("Sender not found: " + request.getSenderUsername()));

            // Find receiver by username
            User receiver = userRepository.findByUsername(request.getRecipientUsername())
                .orElseThrow(() -> new UserNotFoundException("Recipient not found: " + request.getRecipientUsername()));

            // Check if receiver is connected
            String receiverSessionId = sessionManager.getSessionId(receiver.getUsername());
            System.out.println("Receiver session ID: " + receiverSessionId);

            // Create and save message temporarily
            Message message = messageService.sendMessage(
                sender.getId(),
                receiver.getId(),
                request.getContent()
            );

            // Create response with all details
            MessageResponse response = new MessageResponse(
                message.getId(),
                sender.getId(),
                sender.getUsername(),
                receiver.getId(),
                message.getContent(),
                message.getTimestamp(),
                message.getDelivered()
            );

            System.out.println("=== ATTEMPTING TO SEND MESSAGE ===");
            
            // Try sending using username-based routing
            messagingTemplate.convertAndSendToUser(
                receiver.getUsername(),
                "/queue/messages",
                response
            );
            
            System.out.println("Message sent to user: " + receiver.getUsername());
            System.out.println("Expected destination: /user/" + receiver.getUsername() + "/queue/messages");

            // Mark as delivered and delete from server
            messageService.markAsDelivered(message.getId());
            
            System.out.println("=== MESSAGE PROCESSING COMPLETE ===");
            
        } catch (UserNotFoundException e) {
            System.err.println("User not found: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Failed to deliver message: " + e.getMessage());
            e.printStackTrace();
            throw new MessageDeliveryException("Failed to deliver message: " + e.getMessage());
        }
    }
}