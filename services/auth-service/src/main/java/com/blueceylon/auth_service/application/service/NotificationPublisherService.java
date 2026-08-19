package com.blueceylon.auth_service.application.service;

import com.blueceylon.auth_service.application.dto.NotificationEvent;
import com.blueceylon.auth_service.infrastructure.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationPublisherService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishWelcomeEvent(String email, String firstName) {
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", firstName);
        
        NotificationEvent event = new NotificationEvent(
                email,
                "Welcome to Blue Ceylon!",
                "welcome",
                variables
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "email.routing.key", event);
    }

    public void publishVerificationEvent(String email, String firstName, String token) {
        Map<String, Object> variables = new java.util.HashMap<>();
        variables.put("userName", firstName != null ? firstName : "User");
        variables.put("verificationUrl", "http://localhost:3000/verify-email?token=" + token);
        
        NotificationEvent event = new NotificationEvent(
                email,
                "Verify your Blue Ceylon account",
                "email-verification",
                variables
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "email.routing.key", event);
    }
}
