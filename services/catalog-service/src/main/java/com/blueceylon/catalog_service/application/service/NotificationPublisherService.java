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
        if (!org.springframework.util.StringUtils.hasText(contactEmail)) {
            System.err.println("Warning: Cannot send approval notification because contactEmail is null/empty for: " + businessName);
            return;
        }
        java.util.Map<String, Object> vars = new java.util.HashMap<>();
        vars.put("businessName", businessName != null ? businessName : "Partner");
        NotificationEvent event = new NotificationEvent(
                contactEmail,
                "Profile Approved - Welcome to Blue Ceylon!",
                "profile_approved",
                vars
        );
        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "email.routing.key", event);
            System.out.println("Successfully published approval email event to RabbitMQ for " + contactEmail);
        } catch (Exception e) {
            System.err.println("Failed to publish approval notification event: " + e.getMessage());
        }
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

    public void publishBusinessApprovedEvent(String ownerId, String businessType) {
        com.blueceylon.catalog_service.application.dto.BusinessApprovedEvent event =
                new com.blueceylon.catalog_service.application.dto.BusinessApprovedEvent(ownerId, businessType);
        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "business.approved", event);
        } catch (Exception e) {
            System.err.println("Warning: Could not publish BusinessApprovedEvent over RabbitMQ: " + e.getMessage());
        }
    }
}

