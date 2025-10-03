package com.mynetrunner.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for development
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Allow auth endpoints
                .requestMatchers("/api/health").permitAll() // Allow health check
                .requestMatchers("/ws/**").permitAll() // Allow WebSocket connections
                .anyRequest().permitAll() // Allow all other requests for now
            );
        
        return http.build();
    }
}