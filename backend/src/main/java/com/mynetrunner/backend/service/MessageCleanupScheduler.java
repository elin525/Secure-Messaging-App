package com.mynetrunner.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MessageCleanupScheduler {
    
    @Autowired
    private MessageService messageService;
    
    /**
     * Runs every day at 3 AM to clean up expired messages
     * Cron format: second, minute, hour, day, month, weekday
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupExpiredMessages() {
        System.out.println("Running scheduled cleanup of expired messages...");
        messageService.deleteExpiredMessages();
        System.out.println("Expired messages cleanup completed.");
    }
    
    /**
     * Alternative: Run every hour (for testing)
     * Uncomment this and comment out the cron above if you want to test more frequently
     */
    // @Scheduled(fixedRate = 3600000) // Every hour in milliseconds
    // public void cleanupExpiredMessagesHourly() {
    //     System.out.println("Running hourly cleanup of expired messages...");
    //     messageService.deleteExpiredMessages();
    //     System.out.println("Expired messages cleanup completed.");
    // }
}