package com.mynetrunner.backend.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class MessageRequest {
    
    @NotNull(message = "Sender ID is required")
    @Positive(message = "Sender ID must be a positive number")
    private Long senderId;
    
    @NotNull(message = "Receiver ID is required")
    @Positive(message = "Receiver ID must be a positive number")
    private Long receiverId;
    
    @NotBlank(message = "Message content cannot be empty")
    @Size(max = 5000, message = "Message cannot exceed 5000 characters")
    private String content;
    
    // Constructors
    public MessageRequest() {}
    
    public MessageRequest(Long senderId, Long receiverId, String content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getSenderId() {
        return senderId;
    }
    
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }
    
    public Long getReceiverId() {
        return receiverId;
    }
    
    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}