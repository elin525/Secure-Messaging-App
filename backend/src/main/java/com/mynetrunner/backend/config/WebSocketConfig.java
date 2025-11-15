package com.mynetrunner.backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker
        // Messages sent to destinations starting with "/topic" will be routed to subscribers
        config.enableSimpleBroker("/topic", "/queue");

        // Messages sent to destinations starting with "/app" will be routed to @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint that clients will connect to
        // Endpoint: ws://localhost:8080/ws
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000") // React frontend origin
                .withSockJS(); // Fallback option for browsers that don't support WebSocket
    }
}