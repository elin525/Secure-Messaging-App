package com.mynetrunner.backend.dto.message;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;
    private Boolean delivered;
}