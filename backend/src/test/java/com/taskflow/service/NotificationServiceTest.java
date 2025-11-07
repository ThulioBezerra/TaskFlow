package com.taskflow.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void testSendNotification() {
        String webhookUrl = "http://example.com/webhook";
        String message = "Test notification";
        String payload = "{\"text\":\"" + message + "\"}";

        notificationService.sendNotification(webhookUrl, message);

        verify(restTemplate).postForEntity(webhookUrl, payload, String.class);
    }
}
