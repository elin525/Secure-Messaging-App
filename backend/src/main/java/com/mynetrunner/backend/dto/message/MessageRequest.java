package com.mynetrunner.backend.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MessageRequest {
    
    @NotBlank(message = "Sender username is required")
    private String senderUsername;
    
    @NotBlank(message = "Recipient username is required")
    private String recipientUsername;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 1000, message = "Message must be between 1 and 1000 characters")
    private String content;

    // Constructors
    public MessageRequest() {}

    public MessageRequest(String senderUsername, String recipientUsername, String content) {
        this.senderUsername = senderUsername;
        this.recipientUsername = recipientUsername;
        this.content = content;
    }

    // Getters and Setters
    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}