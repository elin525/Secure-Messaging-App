package com.mynetrunner.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mynetrunner.backend.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Find all undelivered messages for a specific receiver
    List<Message> findByReceiverIdAndDeliveredFalse(Long receiverId);
    
    // Delete expired messages (cleanup job will use this)
    @Modifying
    @Transactional
    @Query("DELETE FROM Message m WHERE m.expiresAt < :now")
    void deleteExpiredMessages(LocalDateTime now);
    
    // Delete delivered messages (called after successful delivery)
    @Modifying
    @Transactional
    void deleteById(Long id);
}