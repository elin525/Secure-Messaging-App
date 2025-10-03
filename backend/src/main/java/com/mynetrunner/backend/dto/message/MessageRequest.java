package com.mynetrunner.backend.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {
    
    @NotNull(message = "Sender ID is required")
    private Long senderId; // For testing - will be extracted from JWT later
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    
    @NotBlank(message = "Message content cannot be empty")
    private String content;
}