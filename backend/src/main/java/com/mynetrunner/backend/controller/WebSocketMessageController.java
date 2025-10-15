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

import jakarta.validation.Valid;

@Controller
public class WebSocketMessageController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private UserRepository userRepository;
    
    @MessageMapping("/chat")
    public void sendMessage(@Valid @Payload MessageRequest request) {
        try {
            // Validate sender exists
            User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new UserNotFoundException("Sender not found"));

            // Validate receiver exists
            userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new UserNotFoundException("Receiver not found"));

            // Create and save message temporarily
            Message message = messageService.sendMessage(
                request.getSenderId(),
                request.getReceiverId(),
                request.getContent()
            );

            // Create response with sender username
            MessageResponse response = new MessageResponse(
                message.getId(),
                message.getSenderId(),
                sender.getUsername(),
                message.getReceiverId(),
                message.getContent(),
                message.getTimestamp(),
                message.getDelivered()
            );

            // Send to receiver's topic
            messagingTemplate.convertAndSend(
                "/topic/messages/" + request.getReceiverId(),
                response
            );

            // Mark as delivered and delete from server
            messageService.markAsDelivered(message.getId());

        } catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new MessageDeliveryException("Failed to deliver message: " + e.getMessage());
        }
    }
}