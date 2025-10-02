package com.mynetrunner.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mynetrunner.backend.dto.message.MessageRequest;
import com.mynetrunner.backend.dto.message.MessageResponse;
import com.mynetrunner.backend.model.Message;
import com.mynetrunner.backend.model.User;
import com.mynetrunner.backend.repository.MessageRepository;
import com.mynetrunner.backend.repository.UserRepository;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Send a message (temporarily store until delivered)
     */
    public MessageResponse sendMessage(Long senderId, MessageRequest request) {
        // Verify sender exists
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        // Verify receiver exists
        User receiver = userRepository.findById(request.getReceiverId())
            .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        // Create and save message
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(request.getReceiverId());
        message.setContent(request.getContent());
        message.setDelivered(false);
        
        Message savedMessage = messageRepository.save(message);
        
        return convertToResponse(savedMessage, sender.getUsername());
    }
    
    /**
     * Get all pending (undelivered) messages for a user
     */
    public List<MessageResponse> getPendingMessages(Long userId) {
        List<Message> messages = messageRepository.findByReceiverIdAndDeliveredFalse(userId);
        
        return messages.stream()
            .map(message -> {
                User sender = userRepository.findById(message.getSenderId())
                    .orElse(null);
                String senderUsername = sender != null ? sender.getUsername() : "Unknown";
                return convertToResponse(message, senderUsername);
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Mark message as delivered and DELETE from server (privacy-focused)
     */
    @Transactional
    public void markAsDelivered(Long messageId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Immediately delete from database after delivery
        messageRepository.deleteById(messageId);
    }
    
    /**
     * Delete expired messages (called by scheduled job)
     */
    @Transactional
    public void deleteExpiredMessages() {
        messageRepository.deleteExpiredMessages(LocalDateTime.now());
    }
    
    /**
     * Convert Message entity to MessageResponse DTO
     */
    private MessageResponse convertToResponse(Message message, String senderUsername) {
        return new MessageResponse(
            message.getId(),
            message.getSenderId(),
            senderUsername,
            message.getReceiverId(),
            message.getContent(),
            message.getTimestamp(),
            message.getDelivered()
        );
    }
}