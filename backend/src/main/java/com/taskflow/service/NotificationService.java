package com.taskflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationService {

    private final RestTemplate restTemplate;

    @Autowired
    public NotificationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Async
    public void sendNotification(String webhookUrl, String message) {
        try {
            // Simple implementation: send the message as a JSON payload
            // A more robust implementation would use a DTO and Jackson for serialization
            String payload = "{\"text\":\"" + message + "\"}";
            restTemplate.postForEntity(webhookUrl, payload, String.class);
        } catch (Exception e) {
            // Log the exception in a real application
            System.err.println("Error sending notification: " + e.getMessage());
        }
    }
}
