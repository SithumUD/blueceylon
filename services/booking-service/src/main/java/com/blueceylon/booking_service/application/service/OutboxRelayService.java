package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.model.OutboxEvent;
import com.blueceylon.booking_service.domain.repository.OutboxEventRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutboxRelayService {

    private final OutboxEventRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    
    private static final String EXCHANGE_NAME = "notification.exchange";
    private static final String ROUTING_KEY = "email.routing.key";

    public OutboxRelayService(OutboxEventRepository outboxRepository, RabbitTemplate rabbitTemplate) {
        this.outboxRepository = outboxRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Scheduled(fixedRate = 2000) // Poll every 2 seconds
    public void relayOutboxEvents() {
        List<OutboxEvent> batch = outboxRepository.findTop50ByStatusOrderByCreatedAtAsc("PENDING");
        for (OutboxEvent event : batch) {
            try {
                // The payload is already a JSON string of NotificationEvent
                // We'll send it as a raw string and let Spring AMQP Jackson converter handle it
                // Wait, if it's already a JSON string, sending it with Jackson converter might double-escape it.
                // We need to send it safely. 
                // We can parse it back to an object first.
                // Actually, since this is MVP, we can just send the string.
                rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, event.getPayload(), m -> {
                    m.getMessageProperties().setContentType("application/json");
                    return m;
                });
                event.markPublished();
            } catch (Exception e) {
                event.incrementRetry();
            }
            outboxRepository.save(event);
        }
    }
}
