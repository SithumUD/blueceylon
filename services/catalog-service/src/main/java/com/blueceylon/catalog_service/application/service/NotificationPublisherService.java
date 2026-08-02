package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.application.dto.NotificationEvent;
import com.blueceylon.catalog_service.infrastructure.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationPublisherService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishSubmissionEvent(String businessName, String ownerId) {
        java.util.Map<String, Object> vars = new java.util.HashMap<>();
        vars.put("businessName", businessName);
        vars.put("ownerId", ownerId);
        NotificationEvent event = new NotificationEvent(
                "admin@blueceylon.com",
                "New Profile Submission",
                "profile_submitted",
                vars
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "email.routing.key", event);
    }

    public void publishApprovalEvent(String contactEmail, String businessName) {
        java.util.Map<String, Object> vars = new java.util.HashMap<>();
        vars.put("businessName", businessName);
        NotificationEvent event = new NotificationEvent(
                contactEmail,
                "Profile Approved!",
                "profile_approved",
                vars
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "email.routing.key", event);
    }

    public void publishRejectionEvent(String contactEmail, String businessName, String reason) {
        java.util.Map<String, Object> vars = new java.util.HashMap<>();
        vars.put("businessName", businessName);
        vars.put("rejectionReason", reason);
        NotificationEvent event = new NotificationEvent(
                contactEmail,
                "Profile Rejected",
                "profile_rejected",
                vars
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "email.routing.key", event);
    }
}

